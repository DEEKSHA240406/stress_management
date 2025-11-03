// app/screens/admin/AutoAssignmentScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import {
  SEVERITY_THRESHOLDS,
  COUNSELOR_ASSIGNMENT_THRESHOLD,
  MENTOR_ALERT_THRESHOLD,
  MAX_STUDENTS_PER_MENTOR,
  MAX_ACTIVE_CASES_PER_COUNSELOR,
} from '../../../constants/severityThresholds';

const AutoAssignmentScreen = () => {
  const navigation = useNavigation();
  
  // Auto-assignment settings
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [counselorThreshold, setCounselorThreshold] = useState(COUNSELOR_ASSIGNMENT_THRESHOLD);
  const [mentorAlertThreshold, setMentorAlertThreshold] = useState(MENTOR_ALERT_THRESHOLD);
  const [criticalThreshold, setCriticalThreshold] = useState(SEVERITY_THRESHOLDS.CRITICAL);
  
  // Assignment rules
  const [autoNotifyMentor, setAutoNotifyMentor] = useState(true);
  const [autoNotifyCounselor, setAutoNotifyCounselor] = useState(true);
  const [autoNotifyAdmin, setAutoNotifyAdmin] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  
  // Load balancing
  const [loadBalancingEnabled, setLoadBalancingEnabled] = useState(true);
  const [preferLessLoadedCounselor, setPreferLessLoadedCounselor] = useState(true);
  const [considerSpecialization, setConsiderSpecialization] = useState(true);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // API call to load settings
      // const response = await adminService.getAutoAssignmentSettings();
      // Apply loaded settings
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const settings = {
        autoAssignEnabled,
        counselorThreshold,
        mentorAlertThreshold,
        criticalThreshold,
        autoNotifyMentor,
        autoNotifyCounselor,
        autoNotifyAdmin,
        requireApproval,
        loadBalancingEnabled,
        preferLessLoadedCounselor,
        considerSpecialization,
      };

      // API call to save settings
      // await adminService.saveAutoAssignmentSettings(settings);
      
      Alert.alert('Success', 'Auto-assignment settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleResetDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCounselorThreshold(40);
            setMentorAlertThreshold(60);
            setCriticalThreshold(25);
            setAutoAssignEnabled(true);
            setAutoNotifyMentor(true);
            setAutoNotifyCounselor(true);
            setAutoNotifyAdmin(true);
            setRequireApproval(false);
            setLoadBalancingEnabled(true);
            setPreferLessLoadedCounselor(true);
            setConsiderSpecialization(true);
            setHasChanges(true);
            Alert.alert('Success', 'Settings reset to defaults');
          }
        }
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({ icon, title, subtitle, rightComponent, iconColor }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor + '15' }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  const ThresholdSlider = ({ label, value, onValueChange, min, max, color }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={[styles.valueContainer, { backgroundColor: color + '15' }]}>
          <Text style={[styles.valueText, { color }]}>{Math.round(value)}%</Text>
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={(val) => {
          onValueChange(val);
          setHasChanges(true);
        }}
        minimumTrackTintColor={color}
        maximumTrackTintColor="#E8E8E8"
        thumbTintColor={color}
        step={1}
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{min}%</Text>
        <Text style={styles.sliderLabelText}>{max}%</Text>
      </View>
    </View>
  );

  const InfoCard = ({ icon, title, description, color }) => (
    <View style={[styles.infoCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={24} color={color} />
      <View style={styles.infoCardContent}>
        <Text style={styles.infoCardTitle}>{title}</Text>
        <Text style={styles.infoCardDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#5A52D5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Auto-Assignment</Text>
            <Text style={styles.headerSubtitle}>Configure automatic rules</Text>
          </View>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={handleResetDefaults}
          >
            <Icon name="restore" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Master Switch */}
        <View style={styles.masterSwitch}>
          <View style={styles.masterSwitchLeft}>
            <Icon name="auto-fix" size={28} color="#6C63FF" />
            <View style={styles.masterSwitchInfo}>
              <Text style={styles.masterSwitchTitle}>Auto-Assignment</Text>
              <Text style={styles.masterSwitchSubtitle}>
                {autoAssignEnabled ? 'Enabled - Students auto-assigned to counselors' : 'Disabled - Manual assignment required'}
              </Text>
            </View>
          </View>
          <Switch
            value={autoAssignEnabled}
            onValueChange={(val) => {
              setAutoAssignEnabled(val);
              setHasChanges(true);
            }}
            trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
            thumbColor={autoAssignEnabled ? '#6C63FF' : '#f4f3f4'}
          />
        </View>

        {/* Threshold Settings */}
        <SettingSection title="Score Thresholds">
          <ThresholdSlider
            label="Counselor Assignment Threshold"
            value={counselorThreshold}
            onValueChange={setCounselorThreshold}
            min={20}
            max={60}
            color="#D32F2F"
          />
          <Text style={styles.thresholdDescription}>
            Students scoring below {Math.round(counselorThreshold)}% will be automatically assigned to a counselor
          </Text>

          <ThresholdSlider
            label="Mentor Alert Threshold"
            value={mentorAlertThreshold}
            onValueChange={setMentorAlertThreshold}
            min={40}
            max={80}
            color="#F57C00"
          />
          <Text style={styles.thresholdDescription}>
            Mentors will be alerted when students score below {Math.round(mentorAlertThreshold)}%
          </Text>

          <ThresholdSlider
            label="Critical Alert Threshold"
            value={criticalThreshold}
            onValueChange={setCriticalThreshold}
            min={10}
            max={40}
            color="#D32F2F"
          />
          <Text style={styles.thresholdDescription}>
            Admin will be notified for scores below {Math.round(criticalThreshold)}% - Critical intervention required
          </Text>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection title="Notifications">
          <SettingRow
            icon="bell-ring"
            title="Notify Mentor"
            subtitle="Send notification to mentor when student is assigned to counselor"
            iconColor="#FF6B9D"
            rightComponent={
              <Switch
                value={autoNotifyMentor}
                onValueChange={(val) => {
                  setAutoNotifyMentor(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#FFB4D2' }}
                thumbColor={autoNotifyMentor ? '#FF6B9D' : '#f4f3f4'}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="bell-ring"
            title="Notify Counselor"
            subtitle="Send notification to counselor about new assignment"
            iconColor="#4ECDC4"
            rightComponent={
              <Switch
                value={autoNotifyCounselor}
                onValueChange={(val) => {
                  setAutoNotifyCounselor(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#A7E6E1' }}
                thumbColor={autoNotifyCounselor ? '#4ECDC4' : '#f4f3f4'}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="shield-alert"
            title="Notify Admin"
            subtitle="Alert admin for critical cases"
            iconColor="#FFA726"
            rightComponent={
              <Switch
                value={autoNotifyAdmin}
                onValueChange={(val) => {
                  setAutoNotifyAdmin(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#FFD699' }}
                thumbColor={autoNotifyAdmin ? '#FFA726' : '#f4f3f4'}
              />
            }
          />
        </SettingSection>

        {/* Assignment Rules */}
        <SettingSection title="Assignment Rules">
          <SettingRow
            icon="check-decagram"
            title="Require Approval"
            subtitle="Admin approval required before auto-assignment"
            iconColor="#6C63FF"
            rightComponent={
              <Switch
                value={requireApproval}
                onValueChange={(val) => {
                  setRequireApproval(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#B4AFFF' }}
                thumbColor={requireApproval ? '#6C63FF' : '#f4f3f4'}
              />
            }
          />
        </SettingSection>

        {/* Load Balancing */}
        <SettingSection title="Load Balancing">
          <SettingRow
            icon="scale-balance"
            title="Enable Load Balancing"
            subtitle="Distribute cases evenly among counselors"
            iconColor="#388E3C"
            rightComponent={
              <Switch
                value={loadBalancingEnabled}
                onValueChange={(val) => {
                  setLoadBalancingEnabled(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#A5D6A7' }}
                thumbColor={loadBalancingEnabled ? '#388E3C' : '#f4f3f4'}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="account-group"
            title="Prefer Less Loaded"
            subtitle="Prioritize counselors with fewer active cases"
            iconColor="#4ECDC4"
            rightComponent={
              <Switch
                value={preferLessLoadedCounselor}
                onValueChange={(val) => {
                  setPreferLessLoadedCounselor(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#A7E6E1' }}
                thumbColor={preferLessLoadedCounselor ? '#4ECDC4' : '#f4f3f4'}
                disabled={!loadBalancingEnabled}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="book-open-variant"
            title="Consider Specialization"
            subtitle="Match students with counselor expertise"
            iconColor="#FF6B9D"
            rightComponent={
              <Switch
                value={considerSpecialization}
                onValueChange={(val) => {
                  setConsiderSpecialization(val);
                  setHasChanges(true);
                }}
                trackColor={{ false: '#E8E8E8', true: '#FFB4D2' }}
                thumbColor={considerSpecialization ? '#FF6B9D' : '#f4f3f4'}
                disabled={!loadBalancingEnabled}
              />
            }
          />
        </SettingSection>

        {/* Capacity Limits Info */}
        <SettingSection title="Capacity Limits">
          <InfoCard
            icon="account-supervisor"
            title={`Mentor Capacity: ${MAX_STUDENTS_PER_MENTOR} students`}
            description="Maximum number of students assigned per mentor"
            color="#FFA726"
          />
          <InfoCard
            icon="account-heart"
            title={`Counselor Capacity: ${MAX_ACTIVE_CASES_PER_COUNSELOR} active cases`}
            description="Maximum number of active cases per counselor"
            color="#4ECDC4"
          />
        </SettingSection>

        {/* Save Button */}
        {hasChanges && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Icon name="content-save" size={20} color="#FFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#FFF', opacity: 0.8, marginTop: 2 },
  headerIconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  masterSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  masterSwitchLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  masterSwitchInfo: { marginLeft: 15, flex: 1 },
  masterSwitchTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  masterSwitchSubtitle: { fontSize: 13, color: '#7F8C8D', lineHeight: 18 },
  section: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 12 },
  sectionContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: '#2C3E50', marginBottom: 2 },
  settingSubtitle: { fontSize: 12, color: '#95A5A6', lineHeight: 16 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  sliderContainer: { marginBottom: 20 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sliderLabel: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
  valueContainer: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  valueText: { fontSize: 14, fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -5 },
  sliderLabelText: { fontSize: 12, color: '#95A5A6' },
  thresholdDescription: { fontSize: 12, color: '#7F8C8D', marginTop: -10, marginBottom: 15, lineHeight: 16 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  infoCardContent: { marginLeft: 12, flex: 1 },
  infoCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  infoCardDescription: { fontSize: 12, color: '#7F8C8D', lineHeight: 16 },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
});

export default AutoAssignmentScreen;