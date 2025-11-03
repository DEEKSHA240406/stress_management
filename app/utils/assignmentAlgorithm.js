// app/utils/assignmentAlgorithm.js
import {
  SEVERITY_THRESHOLDS,
  COUNSELOR_ASSIGNMENT_THRESHOLD,
  MAX_STUDENTS_PER_MENTOR,
  MAX_ACTIVE_CASES_PER_COUNSELOR,
  needsCounselorAssignment,
  getSeverityLevel,
} from '../constants/severityThresholds';

/**
 * Auto-assignment algorithm for students to counselors
 * Considers: load balancing, specialization matching, and availability
 */
export const assignmentAlgorithm = {
  /**
   * Find the best counselor for a student based on multiple factors
   */
  findBestCounselor: (student, availableCounselors, settings = {}) => {
    const {
      considerSpecialization = true,
      preferLessLoaded = true,
      requireSpecializationMatch = false,
    } = settings;

    // Filter out counselors at full capacity
    const eligibleCounselors = availableCounselors.filter(
      counselor => counselor.activeCases < MAX_ACTIVE_CASES_PER_COUNSELOR
    );

    if (eligibleCounselors.length === 0) {
      return null; // No available counselors
    }

    // Score each counselor
    const scoredCounselors = eligibleCounselors.map(counselor => ({
      counselor,
      score: calculateCounselorScore(counselor, student, {
        considerSpecialization,
        preferLessLoaded,
      }),
    }));

    // Filter by specialization requirement if needed
    let candidates = scoredCounselors;
    if (requireSpecializationMatch) {
      candidates = scoredCounselors.filter(sc => 
        hasMatchingSpecialization(sc.counselor, student.issues)
      );
      
      // If no match found, fall back to all eligible
      if (candidates.length === 0) {
        candidates = scoredCounselors;
      }
    }

    // Sort by score (highest first)
    candidates.sort((a, b) => b.score - a.score);

    return candidates[0]?.counselor || null;
  },

  /**
   * Distribute students evenly across mentors (max 20 per mentor)
   */
  distributeMentors: (students, mentors) => {
    const assignments = {};
    const mentorLoads = {};

    // Initialize mentor loads
    mentors.forEach(mentor => {
      mentorLoads[mentor.id] = mentor.assignedStudents || 0;
      assignments[mentor.id] = [];
    });

    // Sort students by severity (critical first)
    const sortedStudents = [...students].sort((a, b) => a.score - b.score);

    // Assign each student to mentor with least load
    sortedStudents.forEach(student => {
      // Find mentor with minimum load that hasn't reached capacity
      let selectedMentor = null;
      let minLoad = MAX_STUDENTS_PER_MENTOR + 1;

      for (const mentor of mentors) {
        const currentLoad = mentorLoads[mentor.id];
        if (currentLoad < MAX_STUDENTS_PER_MENTOR && currentLoad < minLoad) {
          minLoad = currentLoad;
          selectedMentor = mentor;
        }
      }

      if (selectedMentor) {
        assignments[selectedMentor.id].push(student.id);
        mentorLoads[selectedMentor.id]++;
      }
    });

    return assignments;
  },

  /**
   * Load balancing - redistribute cases if counselor is overloaded
   */
  rebalanceCounselors: (counselors, cases) => {
    const reassignments = [];
    const avgLoad = cases.length / counselors.length;

    // Find overloaded and underloaded counselors
    const overloaded = counselors.filter(
      c => c.activeCases > avgLoad * 1.5
    );
    const underloaded = counselors.filter(
      c => c.activeCases < avgLoad * 0.5 && 
           c.activeCases < MAX_ACTIVE_CASES_PER_COUNSELOR
    );

    // Suggest reassignments
    overloaded.forEach(counselor => {
      const excessCases = Math.floor(counselor.activeCases - avgLoad);
      const counselorCases = cases.filter(c => c.counselorId === counselor.id);
      
      // Sort by least critical (easier to transfer)
      const transferCandidates = counselorCases
        .sort((a, b) => b.score - a.score)
        .slice(0, excessCases);

      transferCandidates.forEach(caseItem => {
        const targetCounselor = findBestAvailableCounselor(
          underloaded,
          caseItem
        );

        if (targetCounselor) {
          reassignments.push({
            caseId: caseItem.id,
            fromCounselor: counselor.id,
            toCounselor: targetCounselor.id,
            reason: 'load_balancing',
          });
        }
      });
    });

    return reassignments;
  },

  /**
   * Validate if assignment is possible
   */
  validateAssignment: (counselor, student) => {
    const errors = [];

    // Check capacity
    if (counselor.activeCases >= MAX_ACTIVE_CASES_PER_COUNSELOR) {
      errors.push(`Counselor at maximum capacity (${MAX_ACTIVE_CASES_PER_COUNSELOR})`);
    }

    // Check if student needs counselor
    if (!needsCounselorAssignment(student.score)) {
      errors.push(`Student score (${student.score}%) does not require counselor assignment`);
    }

    // Check counselor status
    if (counselor.status !== 'active') {
      errors.push('Counselor is not active');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Get assignment priority based on severity
   */
  getAssignmentPriority: (score) => {
    if (score < SEVERITY_THRESHOLDS.CRITICAL) {
      return { level: 'urgent', priority: 1 };
    } else if (score < SEVERITY_THRESHOLDS.HIGH) {
      return { level: 'high', priority: 2 };
    } else if (score < COUNSELOR_ASSIGNMENT_THRESHOLD) {
      return { level: 'moderate', priority: 3 };
    }
    return { level: 'low', priority: 4 };
  },

  /**
   * Suggest optimal assignments for batch processing
   */
  suggestBatchAssignments: (students, counselors, settings = {}) => {
    const assignments = [];
    const counselorLoads = {};

    // Initialize loads
    counselors.forEach(c => {
      counselorLoads[c.id] = c.activeCases || 0;
    });

    // Sort students by priority
    const sortedStudents = [...students].sort((a, b) => {
      const priorityA = assignmentAlgorithm.getAssignmentPriority(a.score).priority;
      const priorityB = assignmentAlgorithm.getAssignmentPriority(b.score).priority;
      return priorityA - priorityB;
    });

    // Assign each student
    sortedStudents.forEach(student => {
      // Create temporary list with updated loads
      const availableCounselors = counselors.map(c => ({
        ...c,
        activeCases: counselorLoads[c.id],
      }));

      const bestCounselor = assignmentAlgorithm.findBestCounselor(
        student,
        availableCounselors,
        settings
      );

      if (bestCounselor) {
        assignments.push({
          studentId: student.id,
          studentName: student.name,
          studentScore: student.score,
          counselorId: bestCounselor.id,
          counselorName: bestCounselor.name,
          matchScore: calculateCounselorScore(bestCounselor, student, settings),
          priority: assignmentAlgorithm.getAssignmentPriority(student.score),
        });

        // Update temporary load
        counselorLoads[bestCounselor.id]++;
      }
    });

    return assignments;
  },
};

/**
 * Calculate score for counselor-student matching
 * Higher score = better match
 */
function calculateCounselorScore(counselor, student, settings) {
  let score = 0;

  // Factor 1: Availability (0-40 points)
  const capacityRatio = counselor.activeCases / MAX_ACTIVE_CASES_PER_COUNSELOR;
  score += (1 - capacityRatio) * 40;

  // Factor 2: Specialization match (0-30 points)
  if (settings.considerSpecialization && student.issues) {
    const matchScore = calculateSpecializationMatch(
      counselor.specialization || [],
      student.issues
    );
    score += matchScore * 30;
  }

  // Factor 3: Experience (0-15 points)
  score += Math.min(counselor.experience || 0, 15);

  // Factor 4: Success rate (0-15 points)
  score += (counselor.successRate || 0) * 0.15;

  // Bonus: Prefer less loaded if enabled
  if (settings.preferLessLoaded) {
    if (counselor.activeCases < MAX_ACTIVE_CASES_PER_COUNSELOR * 0.5) {
      score += 10;
    }
  }

  return score;
}

/**
 * Calculate specialization match percentage
 */
function calculateSpecializationMatch(specializations, issues) {
  if (!issues || issues.length === 0) return 0;
  if (!specializations || specializations.length === 0) return 0;

  const matches = issues.filter(issue =>
    specializations.some(spec =>
      spec.toLowerCase().includes(issue.toLowerCase()) ||
      issue.toLowerCase().includes(spec.toLowerCase())
    )
  );

  return matches.length / issues.length;
}

/**
 * Check if counselor has matching specialization
 */
function hasMatchingSpecialization(counselor, issues) {
  if (!issues || issues.length === 0) return true;
  if (!counselor.specialization || counselor.specialization.length === 0) return false;

  return issues.some(issue =>
    counselor.specialization.some(spec =>
      spec.toLowerCase().includes(issue.toLowerCase()) ||
      issue.toLowerCase().includes(spec.toLowerCase())
    )
  );
}

/**
 * Find best available counselor from underloaded list
 */
function findBestAvailableCounselor(underloadedCounselors, caseItem) {
  if (underloadedCounselors.length === 0) return null;

  // Sort by capacity and specialization
  const sorted = [...underloadedCounselors].sort((a, b) => {
    const aMatch = hasMatchingSpecialization(a, caseItem.issues || []) ? 1 : 0;
    const bMatch = hasMatchingSpecialization(b, caseItem.issues || []) ? 1 : 0;
    
    if (aMatch !== bMatch) return bMatch - aMatch;
    return a.activeCases - b.activeCases;
  });

  return sorted[0];
}

export default assignmentAlgorithm;