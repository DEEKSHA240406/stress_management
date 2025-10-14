// services/mockAuthService.js - Complete Mock Authentication (No Backend Needed)

// Mock user database (stored in memory)
let mockUsers = [
  {
    id: '1',
    name: 'Test Student',
    email: 'student@test.com',
    password: 'password123', // In real app, this would be hashed
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Test123',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
];

// Helper function to simulate API delay
const simulateDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helper function to generate mock JWT token
const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
  };
  // In real app, this would be a proper JWT
  return `mock_token_${btoa(JSON.stringify(payload))}_${Date.now()}`;
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isStrongPassword = (password) => {
  return (
    password.length >= 6 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
};

/**
 * Login User (Mock)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response object
 */
export const loginUser = async (email, password) => {
  try {
    console.log('🔐 Mock Login attempt:', email);

    // Simulate network delay
    await simulateDelay(800);

    // Validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Please provide both email and password',
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
      };
    }

    // Find user in mock database
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return {
        success: false,
        message: 'User not found. Please check your email or register.',
        statusCode: 404,
      };
    }

    // Check password
    if (user.password !== password) {
      return {
        success: false,
        message: 'Invalid credentials. Please check your password.',
        statusCode: 401,
      };
    }

    // Generate mock token
    const token = generateMockToken(user);

    // Prepare user response (exclude password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    console.log('✅ Mock Login successful:', userResponse);

    return {
      success: true,
      token,
      user: userResponse,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('❌ Mock Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};

/**
 * Register User (Mock)
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (student/admin)
 * @returns {Promise<Object>} Response object
 */
export const registerUser = async (name, email, password, role = 'student') => {
  try {
    console.log('📝 Mock Registration attempt:', { name, email, role });

    // Simulate network delay
    await simulateDelay(1000);

    // Validation
    if (!name || !email || !password) {
      return {
        success: false,
        message: 'Please provide all required fields (name, email, password)',
      };
    }

    if (name.trim().length < 3) {
      return {
        success: false,
        message: 'Name must be at least 3 characters long',
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
      };
    }

    if (!isStrongPassword(password)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters and contain uppercase, lowercase, and number',
      };
    }

    // Check if user already exists
    const existingUser = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered. Please use a different email or login.',
        statusCode: 409,
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In real app, this would be hashed
      role: role || 'student',
      createdAt: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Generate mock token
    const token = generateMockToken(newUser);

    // Prepare user response (exclude password)
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    console.log('✅ Mock Registration successful:', userResponse);

    return {
      success: true,
      token,
      user: userResponse,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error('❌ Mock Registration error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
};

/**
 * Logout User (Mock)
 * @param {string} token - Auth token (not used in mock)
 * @returns {Promise<Object>} Response object
 */
export const logoutUser = async (token) => {
  try {
    await simulateDelay(300);

    console.log('👋 Mock Logout successful');

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('❌ Mock Logout error:', error);
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};

/**
 * Verify Token (Mock)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Response object with user data
 */
export const verifyToken = async (token) => {
  try {
    await simulateDelay(300);

    if (!token || !token.startsWith('mock_token_')) {
      return {
        success: false,
        message: 'Invalid token',
      };
    }

    // Extract user data from token
    try {
      const tokenParts = token.split('_');
      const encodedPayload = tokenParts[2];
      const payload = JSON.parse(atob(encodedPayload));

      // Find user
      const user = mockUsers.find(u => u.id === payload.id);

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      return {
        success: true,
        user: userResponse,
      };
    } catch (decodeError) {
      return {
        success: false,
        message: 'Invalid token format',
      };
    }
  } catch (error) {
    console.error('❌ Mock Token verification error:', error);
    return {
      success: false,
      message: 'Token verification failed',
    };
  }
};

/**
 * Forgot Password (Mock)
 * @param {string} email - User email
 * @returns {Promise<Object>} Response object
 */
export const forgotPassword = async (email) => {
  try {
    await simulateDelay(800);

    if (!email) {
      return {
        success: false,
        message: 'Please provide an email address',
      };
    }

    // Find user
    const user = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    // Don't reveal if user exists (security best practice)
    console.log('🔑 Mock Password reset requested for:', email);

    return {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  } catch (error) {
    console.error('❌ Mock Forgot password error:', error);
    return {
      success: false,
      message: 'Failed to send reset email',
    };
  }
};

/**
 * Reset Password (Mock)
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response object
 */
export const resetPassword = async (token, newPassword) => {
  try {
    await simulateDelay(800);

    if (!token || !newPassword) {
      return {
        success: false,
        message: 'Please provide reset token and new password',
      };
    }

    if (!isStrongPassword(newPassword)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters and contain uppercase, lowercase, and number',
      };
    }

    console.log('🔒 Mock Password reset successful');

    return {
      success: true,
      message: 'Password reset successful',
    };
  } catch (error) {
    console.error('❌ Mock Reset password error:', error);
    return {
      success: false,
      message: 'Failed to reset password',
    };
  }
};

/**
 * Get All Users (Mock - for testing only)
 * @returns {Promise<Object>} Response with all users
 */
export const getAllUsers = async () => {
  try {
    await simulateDelay(500);

    const usersWithoutPasswords = mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return {
      success: true,
      count: mockUsers.length,
      users: usersWithoutPasswords,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch users',
    };
  }
};

/**
 * Update User Profile (Mock)
 * @param {string} userId - User ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>} Response object
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    await simulateDelay(600);

    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      password: mockUsers[userIndex].password, // Don't allow password update via this method
    };

    const userResponse = {
      id: mockUsers[userIndex].id,
      name: mockUsers[userIndex].name,
      email: mockUsers[userIndex].email,
      role: mockUsers[userIndex].role,
      createdAt: mockUsers[userIndex].createdAt,
    };

    console.log('✅ Mock Profile updated:', userResponse);

    return {
      success: true,
      user: userResponse,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('❌ Mock Update profile error:', error);
    return {
      success: false,
      message: 'Failed to update profile',
    };
  }
};

/**
 * Change Password (Mock)
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response object
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    await simulateDelay(800);

    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (user.password !== currentPassword) {
      return {
        success: false,
        message: 'Current password is incorrect',
      };
    }

    if (!isStrongPassword(newPassword)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters and contain uppercase, lowercase, and number',
      };
    }

    // Update password
    user.password = newPassword;

    console.log('✅ Mock Password changed successfully');

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('❌ Mock Change password error:', error);
    return {
      success: false,
      message: 'Failed to change password',
    };
  }
};

// Export default object with all functions
export default {
  loginUser,
  registerUser,
  logoutUser,
  verifyToken,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateUserProfile,
  changePassword,
};