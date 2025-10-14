// app/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

// Import Navigators
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import AdminTabNavigator from './AdminTabNavigator';

// Import other screens
import WelcomeScreen from '../screens/student/WelcomeScreen';
import QuestionScreen from '../screens/student/QuestionScreen';
import ResultScreen from '../screens/student/ResultScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
        setIsLoggedIn(true);
        setUserRole(user.role);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Or a splash screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {/* Main Tab Navigator based on role */}
          <Stack.Screen 
            name="MainTabs" 
            component={userRole === 'admin' ? AdminTabNavigator : TabNavigator} 
          />
          
          {/* Modal/Stack screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;