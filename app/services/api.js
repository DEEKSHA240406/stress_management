import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('@auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request for debugging (remove in production)
      console.log('API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        data: config.data,
      });

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful response (remove in production)
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });

    return response;
  },
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          console.log('Unauthorized - Clearing auth data');
          await AsyncStorage.removeItem('@auth_token');
          await AsyncStorage.removeItem('@user_data');
          // You can dispatch a logout action here if using Redux
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.log('Forbidden - Access denied');
          break;

        case 404:
          // Not found
          console.log('Resource not found');
          break;

        case 422:
          // Validation error
          console.log('Validation error:', data);
          break;

        case 500:
          // Server error
          console.log('Server error');
          break;

        case 503:
          // Service unavailable
          console.log('Service unavailable');
          break;

        default:
          console.log('Unknown error:', status);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API calls with error handling
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    let response;

    switch (method.toLowerCase()) {
      case 'get':
        response = await api.get(url, config);
        break;
      case 'post':
        response = await api.post(url, data, config);
        break;
      case 'put':
        response = await api.put(url, data, config);
        break;
      case 'patch':
        response = await api.patch(url, data, config);
        break;
      case 'delete':
        response = await api.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
  }
};

// Check if API is reachable
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      message: 'API is reachable',
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'API is not reachable',
      error: error.message,
    };
  }
};

// Refresh token function (if you implement refresh tokens)
export const refreshAuthToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('@refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    
    // Save new token
    await AsyncStorage.setItem('@auth_token', response.data.token);
    
    return {
      success: true,
      token: response.data.token,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      message: 'Failed to refresh token',
    };
  }
};

// Upload file function
export const uploadFile = async (url, file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/octet-stream',
      name: file.name || 'file',
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post(url, formData, config);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'File upload failed',
    };
  }
};

// Download file function
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    return {
      success: true,
      data: response.data,
      filename: filename || 'download',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'File download failed',
    };
  }
};

// Set custom header
export const setApiHeader = (key, value) => {
  api.defaults.headers.common[key] = value;
};

// Remove custom header
export const removeApiHeader = (key) => {
  delete api.defaults.headers.common[key];
};

// Update base URL (useful for environment switching)
export const updateBaseURL = (newBaseURL) => {
  api.defaults.baseURL = newBaseURL;
};

// Get current base URL
export const getBaseURL = () => {
  return api.defaults.baseURL;
};

// Clear all auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@refresh_token');
    await AsyncStorage.removeItem('@user_data');
    return { success: true };
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return { success: false };
  }
};

// Batch requests (execute multiple requests concurrently)
export const batchRequests = async (requests) => {
  try {
    const promises = requests.map((request) =>
      apiCall(request.method, request.url, request.data, request.config)
    );

    const results = await Promise.allSettled(promises);

    return {
      success: true,
      results: results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            message: result.reason.message,
          };
        }
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: 'Batch request failed',
      error: error.message,
    };
  }
};

// Retry failed requests
export const retryRequest = async (
  method,
  url,
  data = null,
  maxRetries = 3,
  delay = 1000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await apiCall(method, url, data);
      
      if (result.success) {
        return result;
      }

      lastError = result;
    } catch (error) {
      lastError = error;
    }

    // Wait before retrying (exponential backoff)
    if (i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  return {
    success: false,
    message: `Request failed after ${maxRetries} attempts`,
    error: lastError,
  };
};

// Cancel token source (for cancellable requests)
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Check if error is a cancel error
export const isCancelError = (error) => {
  return axios.isCancel(error);
};

export default api;