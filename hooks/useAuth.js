import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginUser,
  registerUser,
  logoutUser,
  isAuthenticated as checkAuthentication,
} from '../services/authService';
import { setUser, setToken, logout as logoutAction, setLoading, setError } from '../store/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Login
  const login = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const response = await loginUser(email, password);

      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem('@auth_token', response.token);
        await AsyncStorage.setItem('@user_data', JSON.stringify(response.user));

        // Update Redux store
        dispatch(setUser(response.user));
        dispatch(setToken(response.token));

        return { success: true, user: response.user };
      } else {
        dispatch(setError(response.message));
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch(setError(error.message));
      return { success: false, message: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Register
  const register = async (name, email, password, role = 'student') => {
    dispatch(setLoading(true));
    try {
      const response = await registerUser(name, email, password, role);

      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem('@auth_token', response.token);
        await AsyncStorage.setItem('@user_data', JSON.stringify(response.user));

        // Update Redux store
        dispatch(setUser(response.user));
        dispatch(setToken(response.token));

        return { success: true, user: response.user };
      } else {
        dispatch(setError(response.message));
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch(setError(error.message));
      return { success: false, message: error.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout
  const logout = async () => {
    dispatch(setLoading(true));
    try {
      await logoutUser();

      // Clear AsyncStorage
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');

      // Update Redux store
      dispatch(logoutAction());

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const authData = await checkAuthentication();

      if (authData.isAuthenticated && authData.user) {
        dispatch(setUser(authData.user));
        dispatch(setToken(authData.token));
      }

      return authData.isAuthenticated;
    } catch (error) {
      console.error('Check auth error:', error);
      return false;
    }
  };

  // Get current user
  const getCurrentUser = () => {
    return user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is student
  const isStudent = () => {
    return user?.role === 'student';
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || null;
  };

  // Update user data in store
  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUser));
      dispatch(setUser(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Methods
    login,
    register,
    logout,
    checkAuth,
    getCurrentUser,
    updateUser,

    // Helper methods
    isAdmin,
    isStudent,
    getUserRole,
  };
};

export default useAuth;