// app/services/mockAuthService.js

/**
 * Mock Authentication Service
 * Simulates backend authentication for development/testing
 * Supports 4 roles: Student, Mentor, Counselor, Admin
 */

// Mock user database - Simulates backend user records
const MOCK_USERS = [
  // Student Account
  {
    id: 'S001',
    email: 'student@test.com',
    password: 'password123',
    name: 'Raj Kumar',
    role: 'student',
    rollNumber: '20CS001',
    department: 'Computer Science',
    year: 'Third Year',
    batch: '2020-2024',
    phone: '+91 9876543210',
    mentalHealthScore: 75,
    lastAssessment: '2024-10-25',
    assessmentsCompleted: 5,
    mentor: 'Dr. Priya Sharma',
    profileImage: null,
  },

  // Mentor Account
  {
    id: 'M001',
    email: 'mentor@test.com',
    password: 'mentor123',
    name: 'Dr. Priya Sharma',
    role: 'mentor',
    department: 'Psychology',
    designation: 'Assistant Professor',
    phone: '+91 9876543211',
    assignedStudents: 15,
    maxCapacity: 20,
    specialization: ['Academic Stress', 'Career Guidance', 'Time Management'],
    experience: 5,
    profileImage: null,
  },

  // Counselor Account
  {
    id: 'C001',
    email: 'counselor@test.com',
    password: 'counselor123',
    name: 'Dr. Ananya Reddy',
    role: 'counselor',
    designation: 'Clinical Psychologist',
    phone: '+91 9876543212',
    license: 'RCI-12345',
    activeCases: 8,
    maxCapacity: 15,
    specialization: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
    experience: 8,
    successRate: 87,
    completedSessions: 156,
    profileImage: null,
  },

  // Admin Account
  {
    id: 'A001',
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    designation: 'System Administrator',
    phone: '+91 9876543213',
    permissions: ['all'],
    department: 'Administration',
    profileImage: null,
  },
];

/**
 * Login User - Main authentication function
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response
 */
export const loginUser = async (email, password) => {
  console.log('🔐 Mock Login attempt:', email);

  // Simulate network delay (500ms-1500ms)
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    // Find user by email (case insensitive)
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    // User not found
    if (!user) {
      console.log('❌ User not found:', email);
      return {
        success: false,
        message: 'User not found. Please check your email or register.',
      };
    }

    // Invalid password
    if (user.password !== password) {
      console.log('❌ Invalid password for:', email);
      return {
        success: false,
        message: 'Invalid password. Please try again.',
      };
    }

    // Login successful - Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;

    console.log('✅ Login successful:', user.role, user.name);

    return {
      success: true,
      message: 'Login successful',
      token: token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('💥 Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.',
    };
  }
};

/**
 * Register User
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export const registerUser = async (userData) => {
  console.log('📝 Register attempt:', userData.email);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  try {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingUser) {
      console.log('❌ User already exists:', userData.email);
      return {
        success: false,
        message: 'An account with this email already exists. Please login.',
      };
    }

    // Create new user
    const newUser = {
      id: `U${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'student',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
    };

    // Add role-specific fields
    if (newUser.role === 'student') {
      newUser.rollNumber = userData.rollNumber || '';
      newUser.department = userData.department || '';
      newUser.year = userData.year || '';
      newUser.batch = userData.batch || '';
      newUser.mentalHealthScore = 80; // Default starting score
      newUser.assessmentsCompleted = 0;
    }

    // Add to mock database (in real app, this would be a database call)
    MOCK_USERS.push({ ...newUser, password: userData.password });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    // Generate token
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    console.log('✅ Registration successful:', newUser.role, newUser.name);

    return {
      success: true,
      message: 'Registration successful',
      token: token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('💥 Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.',
    };
  }
};

/**
 * Logout User
 * @returns {Promise<Object>} Logout response
 */
export const logoutUser = async () => {
  console.log('👋 Logout attempt');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  console.log('✅ Logout successful');

  return {
    success: true,
    message: 'Logged out successfully',
  };
};

/**
 * Reset Password
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = async (email) => {
  console.log('🔑 Password reset request:', email);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user exists
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  // For security, always return success (don't reveal if email exists)
  console.log(user ? '✅ Reset email sent' : '⚠️ Email not found (but returning success)');

  return {
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent.',
  };
};

/**
 * Validate Token
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Validation response with user data
 */
export const validateToken = async (token) => {
  console.log('🔍 Validating token');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    // Check token format
    if (!token || !token.startsWith('mock_token_')) {
      console.log('❌ Invalid token format');
      return {
        success: false,
        message: 'Invalid token',
      };
    }

    // Extract user ID from token
    const parts = token.split('_');
    if (parts.length < 3) {
      console.log('❌ Malformed token');
      return {
        success: false,
        message: 'Invalid token',
      };
    }

    const userId = parts[2];

    // Find user by ID
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      console.log('❌ User not found for token');
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Token valid for:', user.role, user.name);

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('💥 Token validation error:', error);
    return {
      success: false,
      message: 'Token validation failed',
    };
  }
};

/**
 * Get All Test Accounts (for development)
 * @returns {Array<Object>} List of test accounts
 */
export const getTestAccounts = () => {
  return [
    {
      role: 'student',
      email: 'student@test.com',
      password: 'password123',
      name: 'Raj Kumar',
    },
    {
      role: 'mentor',
      email: 'mentor@test.com',
      password: 'mentor123',
      name: 'Dr. Priya Sharma',
    },
    {
      role: 'counselor',
      email: 'counselor@test.com',
      password: 'counselor123',
      name: 'Dr. Ananya Reddy',
    },
    {
      role: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      name: 'Admin User',
    },
  ];
};

/**
 * Get User By Email (for development/testing)
 * @param {string} email - User email
 * @returns {Object|null} User object without password
 */
export const getUserByEmail = (email) => {
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Check if email exists
 * @param {string} email - User email
 * @returns {boolean} True if email exists
 */
export const emailExists = (email) => {
  return MOCK_USERS.some(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
};

// Default export
export default {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  validateToken,
  getTestAccounts,
  getUserByEmail,
  emailExists,
};