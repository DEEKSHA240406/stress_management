import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../store/slices/authSlice';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Dashboard Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';

// Other Student Screens
import WelcomeScreen from '../screens/student/WelcomeScreen';
import QuestionScreen from '../screens/student/QuestionScreen';
import ResultScreen from '../screens/student/ResultScreen';
import HistoryScreen from '../screens/student/HistoryScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import ResourcesScreen from '../screens/student/ResourcesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        dispatch(setUser(parsedUser));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack - Not logged in
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Main App Stack - Logged in
        <>
          {user?.role === 'admin' ? (
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          ) : (
            <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          )}
          
          {/* Student Screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Resources" component={ResourcesScreen} />
          
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;