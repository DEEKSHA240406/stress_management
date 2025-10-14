import axios from 'axios';

/**
 * ===============================
 * ✅ CONFIGURATION SECTION
 * 1305
 * keep it in mind
 * 
 * ===============================
 */

// 🧩 Use your system IP address here (same network as your mobile/Expo)
const API_BASE_URL = 'http://10.70.253.55:8081'; // 👈 change this if needed

// Notes:
// Android Emulator → use http://10.0.2.2:8081
// iOS Simulator → use http://localhost:8081
// Physical device → use http://YOUR_COMPUTER_IP:8081

/**
 * ===============================
 * 🛠️ AXIOS INSTANCE
 * ===============================
 */

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 🌐 Request Interceptor (debugging)
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('⚠️ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// 🌐 Response Interceptor (debugging)
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

/**
 * ===============================
 * 🧠 AUTH SERVICES
 * ===============================
 */

// 🔹 LOGIN USER
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email: email.toLowerCase().trim(),
      password,
    });

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: 'Login successful',
    };
  } catch (error) {
    console.error('Login Service Error:', error.message);

    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Invalid credentials',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        message:
          'Network error. Please check your connection and ensure the server is running.',
      };
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred during login.',
      };
    }
  }
};

// 🔹 REGISTER USER
export const registerUser = async (name, email, password, role = 'student') => {
  try {
    const response = await apiClient.post('/auth/register', {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error('Registration Service Error:', error.message);

    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Registration failed',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        message:
          'Network error. Please check your connection and ensure the server is running.',
      };
    } else {
      return {
        success: false,
        message: 'Unexpected error occurred during registration.',
      };
    }
  }
};

// 🔹 LOGOUT USER
export const logoutUser = async (token) => {
  try {
    await apiClient.post(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Logout Service Error:', error.message);
    return { success: false, message: 'Logout failed' };
  }
};

// 🔹 VERIFY TOKEN
export const verifyToken = async (token) => {
  try {
    const response = await apiClient.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return { success: false, message: 'Token verification failed' };
  }
};

// 🔹 FORGOT PASSWORD
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', {
      email: email.toLowerCase().trim(),
    });

    return {
      success: true,
      message: response.data.message || 'Password reset email sent',
    };
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send reset email',
    };
  }
};

// 🔹 RESET PASSWORD
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password: newPassword,
    });

    return {
      success: true,
      message: response.data.message || 'Password reset successful',
    };
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password',
    };
  }
};

/**
 * ===============================
 * 🚀 EXPORTS
 * ===============================
 */
export default apiClient;
