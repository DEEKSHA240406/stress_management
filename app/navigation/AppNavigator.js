// app/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from '../store/slices/authSlice';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

// ==========================================
// AUTH SCREENS
// ==========================================
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// ==========================================
// STUDENT SCREENS
// ==========================================
import StudentDashboard from '../screens/student/StudentDashboard';
import WelcomeScreen from '../screens/student/WelcomeScreen';
import QuestionScreen from '../screens/student/QuestionScreen';
import ResultScreen from '../screens/student/ResultScreen';
import HistoryScreen from '../screens/student/HistoryScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import ResourcesScreen from '../screens/student/ResourcesScreen';
import MyMentorScreen from '../screens/student/MyMentorScreen';

// ==========================================
// MENTOR SCREENS
// ==========================================
import MentorDashboard from '../screens/mentor/MentorDashboard';
import MyStudentsScreen from '../screens/mentor/MyStudentsScreen';
import StudentDetailScreen from '../screens/mentor/StudentDetailScreen';
import AlertsScreen from '../screens/mentor/AlertsScreen';
import NotesScreen from '../screens/mentor/NotesScreen';
import MentorProfileScreen from '../screens/mentor/MentorProfileScreen';
import StudentProgressScreen from '../screens/mentor/StudentProgressScreen';

// ==========================================
// COUNSELOR SCREENS
// ==========================================
import CounselorDashboard from '../screens/counselor/CounselorDashboard';
import AssignedStudentsScreen from '../screens/counselor/AssignedStudentsScreen';
import StudentCaseScreen from '../screens/counselor/StudentCaseScreen';
import SessionNotesScreen from '../screens/counselor/SessionNotesScreen';
import TreatmentPlanScreen from '../screens/counselor/TreatmentPlanScreen';
import UrgentCasesScreen from '../screens/counselor/UrgentCasesScreen';
import CounselorProfileScreen from '../screens/counselor/CounselorProfileScreen';

// ==========================================
// ADMIN SCREENS
// ==========================================
import AdminDashboard from '../screens/admin/AdminDashboard';
import MentorManagementScreen from '../screens/admin/MentorManagementScreen';
import CounselorManagementScreen from '../screens/admin/CounselorManagementScreen';
import AutoAssignmentScreen from '../screens/admin/AutoAssignmentScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';
import DetailedReportScreen from '../screens/admin/DetailedReportScreen';
import ExportReportScreen from '../screens/admin/ExportReportScreen';
import SettingScreen from '../screens/admin/SettingScreen';
import StudentListScreen from '../screens/admin/StudentListScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// STUDENT TAB NAVIGATOR
// ==========================================
const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={StudentDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Resources" component={ResourcesScreen} options={{ tabBarLabel: 'Resources' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

// ==========================================
// MENTOR TAB NAVIGATOR
// ==========================================
const MentorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'MyStudents') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={MentorDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="MyStudents" component={MyStudentsScreen} options={{ tabBarLabel: 'Students' }} />
      <Tab.Screen name="Progress" component={StudentProgressScreen} options={{ tabBarLabel: 'Progress' }} />
      <Tab.Screen name="Profile" component={MentorProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

// ==========================================
// COUNSELOR TAB NAVIGATOR
// ==========================================
const CounselorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'MyCases') {
            iconName = focused ? 'folder-account' : 'folder-account-outline';
          } else if (route.name === 'Urgent') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={CounselorDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="MyCases" component={AssignedStudentsScreen} options={{ tabBarLabel: 'Cases' }} />
      <Tab.Screen name="Urgent" component={UrgentCasesScreen} options={{ tabBarLabel: 'Urgent' }} />
      <Tab.Screen name="Profile" component={CounselorProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

// ==========================================
// ADMIN TAB NAVIGATOR
// ==========================================
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="Students" component={StudentListScreen} options={{ tabBarLabel: 'Students' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
};

// ==========================================
// MAIN APP NAVIGATOR
// ==========================================
const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log('🔍 Checking login status...');
      
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User found in storage:', parsedUser.role, parsedUser.name);
        dispatch(setUser(parsedUser));
      } else {
        console.log('❌ No user found in storage');
        dispatch(logout());
      }
    } catch (error) {
      console.error('💥 Error checking login status:', error);
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // ==========================================
        // AUTH STACK
        // ==========================================
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // ==========================================
        // AUTHENTICATED STACKS
        // ==========================================
        <>
          {/* ============ STUDENT STACK ============ */}
          {user?.role === 'student' && (
            <>
              <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
              <Stack.Screen name="ResultScreen" component={ResultScreen} />
              <Stack.Screen name="MyMentor" component={MyMentorScreen} />
              <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
              <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="ResourcesScreen" component={ResourcesScreen} />
            </>
          )}

          {/* ============ MENTOR STACK ============ */}
          {user?.role === 'mentor' && (
            <>
              <Stack.Screen name="MentorTabs" component={MentorTabNavigator} />
              <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
              <Stack.Screen name="Alerts" component={AlertsScreen} />
              <Stack.Screen name="Notes" component={NotesScreen} />
              <Stack.Screen name="MentorDashboard" component={MentorDashboard} />
              <Stack.Screen name="MentorProfile" component={MentorProfileScreen} />
              <Stack.Screen name="MyStudents" component={MyStudentsScreen} />
              <Stack.Screen name="StudentProgress" component={StudentProgressScreen} />
            </>
          )}

          {/* ============ COUNSELOR STACK ============ */}
          {user?.role === 'counselor' && (
            <>
              <Stack.Screen name="CounselorTabs" component={CounselorTabNavigator} />
              <Stack.Screen name="AssignedStudents" component={AssignedStudentsScreen} />
              <Stack.Screen name="StudentCase" component={StudentCaseScreen} />
              <Stack.Screen name="SessionNotes" component={SessionNotesScreen} />
              <Stack.Screen name="TreatmentPlan" component={TreatmentPlanScreen} />
              <Stack.Screen name="UrgentCases" component={UrgentCasesScreen} />
              <Stack.Screen name="CounselorProfile" component={CounselorProfileScreen} />
              <Stack.Screen name="CounselorDashboard" component={CounselorDashboard} />
            </>
          )}

          {/* ============ ADMIN STACK ============ */}
          {user?.role === 'admin' && (
            <>
              <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="MentorManagement" component={MentorManagementScreen} />
              <Stack.Screen name="CounselorManagement" component={CounselorManagementScreen} />
              <Stack.Screen name="AutoAssignment" component={AutoAssignmentScreen} />
              <Stack.Screen name="Analytics" component={AnalyticsScreen} />
              <Stack.Screen name="DetailedReport" component={DetailedReportScreen} />
              <Stack.Screen name="ExportReport" component={ExportReportScreen} />
              <Stack.Screen name="SettingScreen" component={SettingScreen} />
              <Stack.Screen name="StudentList" component={StudentListScreen} />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});

export default AppNavigator;