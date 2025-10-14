import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAllQuestions,
  setCurrentQuestions,
  setCurrentQuestionIndex,
  nextQuestion as nextQuestionAction,
  previousQuestion as previousQuestionAction,
  addAnswer,
  startAssessment as startAssessmentAction,
  completeAssessment as completeAssessmentAction,
  resetAssessment as resetAssessmentAction,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectCurrentQuestions,
  selectAnswers,
  selectAssessmentStarted,
  selectAssessmentCompleted,
  selectAssessmentProgress,
} from '../store/slices/questionSlice';
import {
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionsWithOfflineSupport,
} from '../services/questionService';

const useQuestions = () => {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const currentQuestionIndex = useSelector(selectCurrentQuestionIndex);
  const currentQuestions = useSelector(selectCurrentQuestions);
  const answers = useSelector(selectAnswers);
  const assessmentStarted = useSelector(selectAssessmentStarted);
  const assessmentCompleted = useSelector(selectAssessmentCompleted);
  const progress = useSelector(selectAssessmentProgress);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all questions
  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllQuestions();
      if (response.success) {
        dispatch(setAllQuestions(response.questions));
        return { success: true, questions: response.questions };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load questions by category
  const loadQuestionsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuestionsByCategory(category);
      if (response.success) {
        return { success: true, questions: response.questions };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load questions with offline support
  const loadQuestionsOffline = async (category = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuestionsWithOfflineSupport(category);
      if (response.success) {
        dispatch(setAllQuestions(response.questions));
        return { success: true, questions: response.questions };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Start assessment
  const startAssessment = (questions) => {
    dispatch(startAssessmentAction(questions));
  };

  // Complete assessment
  const completeAssessment = () => {
    dispatch(completeAssessmentAction());
  };

  // Reset assessment
  const resetAssessment = () => {
    dispatch(resetAssessmentAction());
  };

  // Navigate to next question
  const nextQuestion = () => {
    dispatch(nextQuestionAction());
  };

  // Navigate to previous question
  const previousQuestion = () => {
    dispatch(previousQuestionAction());
  };

  // Go to specific question
  const goToQuestion = (index) => {
    dispatch(setCurrentQuestionIndex(index));
  };

  // Answer current question
  const answerQuestion = (answer) => {
    if (currentQuestion) {
      dispatch(addAnswer({
        questionId: currentQuestion.id,
        question: currentQuestion.text,
        answer: answer,
        category: currentQuestion.category,
        timestamp: new Date().toISOString(),
      }));
    }
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    return answers.some((a) => a.questionId === currentQuestion.id);
  };

  // Get answer for current question
  const getCurrentQuestionAnswer = () => {
    if (!currentQuestion) return null;
    const answer = answers.find((a) => a.questionId === currentQuestion.id);
    return answer ? answer.answer : null;
  };

  // Check if can go to next question
  const canGoNext = () => {
    return currentQuestionIndex < currentQuestions.length - 1;
  };

  // Check if can go to previous question
  const canGoPrevious = () => {
    return currentQuestionIndex > 0;
  };

  // Check if assessment is complete
  const isAssessmentComplete = () => {
    return answers.length === currentQuestions.length;
  };

  // Get progress percentage
  const getProgress = () => {
    return progress;
  };

  // Get total questions
  const getTotalQuestions = () => {
    return currentQuestions.length;
  };

  // Get answered questions count
  const getAnsweredCount = () => {
    return answers.length;
  };

  return {
    // State
    currentQuestion,
    currentQuestionIndex,
    currentQuestions,
    answers,
    assessmentStarted,
    assessmentCompleted,
    progress,
    loading,
    error,

    // Load methods
    loadQuestions,
    loadQuestionsByCategory,
    loadQuestionsOffline,

    // Assessment control
    startAssessment,
    completeAssessment,
    resetAssessment,

    // Navigation
    nextQuestion,
    previousQuestion,
    goToQuestion,

    // Answer methods
    answerQuestion,
    isCurrentQuestionAnswered,
    getCurrentQuestionAnswer,

    // Helper methods
    canGoNext,
    canGoPrevious,
    isAssessmentComplete,
    getProgress,
    getTotalQuestions,
    getAnsweredCount,
  };
};

export default useQuestions;