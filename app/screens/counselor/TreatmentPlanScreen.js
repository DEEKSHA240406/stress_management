// app/screens/counselor/TreatmentPlanScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const TreatmentPlanScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params || {};

  const [diagnosis, setDiagnosis] = useState('');
  const [goals, setGoals] = useState(['']);
  const [interventions, setInterventions] = useState(['']);
  const [frequency, setFrequency] = useState('Weekly');
  const [duration, setDuration] = useState('8-12 weeks');
  const [medications, setMedications] = useState('');
  const [referrals, setReferrals] = useState('');

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const updateGoal = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const removeGoal = (index) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  const addIntervention = () => {
    setInterventions([...interventions, '']);
  };

  const updateIntervention = (index, value) => {
    const newInterventions = [...interventions];
    newInterventions[index] = value;
    setInterventions(newInterventions);
  };

  const removeIntervention = (index) => {
    const newInterventions = interventions.filter((_, i) => i !== index);
    setInterventions(newInterventions);
  };

  const handleSave = () => {
    if (!diagnosis.trim()) {
      Alert.alert('Error', 'Please enter a diagnosis');
      return;
    }

    Alert.alert('Success', 'Treatment plan saved successfully!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4ECDC4" />

      <LinearGradient colors={['#4ECDC4', '#44B8B0']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Treatment Plan</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Diagnosis</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter primary diagnosis..."
          value={diagnosis}
          onChangeText={setDiagnosis}
          multiline
        />

        <Text style={styles.sectionTitle}>Treatment Goals</Text>
        {goals.map((goal, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              style={[styles.textInput, styles.flex1]}
              placeholder={`Goal ${index + 1}`}
              value={goal}
              onChangeText={(value) => updateGoal(index, value)}
              multiline
            />
            <TouchableOpacity onPress={() => removeGoal(index)} style={styles.removeButton}>
              <Icon name="close-circle" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addGoal} style={styles.addButton}>
          <Icon name="plus-circle" size={20} color="#4ECDC4" />
          <Text style={styles.addButtonText}>Add Goal</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Interventions</Text>
        {interventions.map((intervention, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              style={[styles.textInput, styles.flex1]}
              placeholder={`Intervention ${index + 1}`}
              value={intervention}
              onChangeText={(value) => updateIntervention(index, value)}
              multiline
            />
            <TouchableOpacity onPress={() => removeIntervention(index)} style={styles.removeButton}>
              <Icon name="close-circle" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addIntervention} style={styles.addButton}>
          <Icon name="plus-circle" size={20} color="#4ECDC4" />
          <Text style={styles.addButtonText}>Add Intervention</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Session Details</Text>
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Frequency</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Weekly"
              value={frequency}
              onChangeText={setFrequency}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.textInput}
              placeholder="8-12 weeks"
              value={duration}
              onChangeText={setDuration}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Medications (if any)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="List any prescribed medications..."
          value={medications}
          onChangeText={setMedications}
          multiline
        />

        <Text style={styles.sectionTitle}>Referrals</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Psychiatrist, support groups, etc..."
          value={referrals}
          onChangeText={setReferrals}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Treatment Plan</Text>
        </TouchableOpacity>

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', flex: 1, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 20, marginBottom: 10 },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 10,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  flex1: { flex: 1, marginRight: 10 },
  removeButton: { padding: 5 },
  addButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  addButtonText: { fontSize: 14, color: '#4ECDC4', fontWeight: '600', marginLeft: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { flex: 1, marginHorizontal: 5 },
  label: { fontSize: 12, color: '#7F8C8D', marginBottom: 6, fontWeight: '600' },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});

export default TreatmentPlanScreen;