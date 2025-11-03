// app/screens/mentor/NotesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

const NotesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentId } = route.params || {};
  const { user } = useSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, recent, important
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('general'); // general, behavioral, academic, emotional

  useEffect(() => {
    fetchNotes();
  }, [studentId]);

  const fetchNotes = async () => {
    try {
      // API call
      // const response = await mentorService.getNotes(user.id, studentId);
      
      // Mock data
      const mockNotes = [
        {
          id: 1,
          studentId: 'S001',
          studentName: 'Priya Kumar',
          title: 'Follow-up Session Discussion',
          content: 'Student showed signs of improvement in managing stress. Discussed time management techniques and recommended the Pomodoro method. Will follow up next week to track progress.',
          category: 'behavioral',
          isImportant: true,
          createdAt: '2024-10-27T10:30:00',
          updatedAt: '2024-10-27T10:30:00',
        },
        {
          id: 2,
          studentId: 'S002',
          studentName: 'Rahul Sharma',
          title: 'Academic Stress Concerns',
          content: 'Student expressed feeling overwhelmed with coursework. Suggested breaking down assignments into smaller tasks. Referred to academic support services.',
          category: 'academic',
          isImportant: true,
          createdAt: '2024-10-26T14:00:00',
          updatedAt: '2024-10-26T14:00:00',
        },
        {
          id: 3,
          studentId: 'S003',
          studentName: 'Anjali Patel',
          title: 'General Check-in',
          content: 'Regular check-in session. Student is doing well overall. Mentioned some family concerns but coping well. Will continue monthly check-ins.',
          category: 'general',
          isImportant: false,
          createdAt: '2024-10-25T11:00:00',
          updatedAt: '2024-10-25T11:00:00',
        },
        {
          id: 4,
          studentId: 'S001',
          studentName: 'Priya Kumar',
          title: 'Emotional Support Session',
          content: 'Student opened up about feeling isolated. Discussed ways to build social connections on campus. Recommended joining student clubs and support groups.',
          category: 'emotional',
          isImportant: false,
          createdAt: '2024-10-20T09:30:00',
          updatedAt: '2024-10-20T09:30:00',
        },
        {
          id: 5,
          studentId: 'S004',
          studentName: 'Arjun Reddy',
          title: 'Behavioral Observation',
          content: 'Noticed positive changes in attendance and engagement. Student appears more confident and participative in group activities.',
          category: 'behavioral',
          isImportant: false,
          createdAt: '2024-10-18T16:00:00',
          updatedAt: '2024-10-18T16:00:00',
        },
      ];

      // Filter by student if studentId is provided
      const filteredNotes = studentId 
        ? mockNotes.filter(note => note.studentId === studentId)
        : mockNotes;

      setNotes(filteredNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('general');
    setModalVisible(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // API call to save note
      // if (editingNote) {
      //   await mentorService.updateNote(editingNote.id, { title, content, category });
      // } else {
      //   await mentorService.createNote({ studentId, title, content, category });
      // }

      Alert.alert('Success', editingNote ? 'Note updated successfully' : 'Note added successfully');
      setModalVisible(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleDeleteNote = (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // API call
              // await mentorService.deleteNote(noteId);
              setNotes(notes.filter(note => note.id !== noteId));
              Alert.alert('Success', 'Note deleted successfully');
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'behavioral': return '#6C63FF';
      case 'academic': return '#4CAF50';
      case 'emotional': return '#FF6B9D';
      default: return '#95A5A6';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'behavioral': return 'account-check';
      case 'academic': return 'school';
      case 'emotional': return 'heart';
      default: return 'note-text';
    }
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === value && styles.filterTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const CategoryButton = ({ label, value, icon }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        noteCategory === value && styles.categoryButtonActive
      ]}
      onPress={() => setNoteCategory(value)}
      activeOpacity={0.7}
    >
      <Icon 
        name={icon} 
        size={20} 
        color={noteCategory === value ? '#FFF' : getCategoryColor(value)} 
      />
      <Text style={[
        styles.categoryButtonText,
        noteCategory === value && styles.categoryButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const NoteCard = ({ note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onLongPress={() => handleEditNote(note)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteHeaderLeft}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(note.category) + '20' }
          ]}>
            <Icon 
              name={getCategoryIcon(note.category)} 
              size={16} 
              color={getCategoryColor(note.category)} 
            />
          </View>
          <View style={styles.noteHeaderInfo}>
            <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
            {!studentId && (
              <Text style={styles.noteStudent}>{note.studentName}</Text>
            )}
          </View>
        </View>
        <View style={styles.noteHeaderRight}>
          {note.isImportant && (
            <Icon name="star" size={18} color="#FFA726" style={{ marginRight: 8 }} />
          )}
          <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
            <Icon name="delete-outline" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.noteContent} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
        <TouchableOpacity onPress={() => handleEditNote(note)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredNotes = notes.filter(note => {
    if (selectedFilter === 'important') return note.isImportant;
    if (selectedFilter === 'recent') {
      const daysSince = (new Date() - new Date(note.createdAt)) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }
    return true;
  });

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
            <Text style={styles.headerTitle}>
              {studentId ? 'Student Notes' : 'All Notes'}
            </Text>
            <Text style={styles.headerSubtitle}>{notes.length} notes</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddNote}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterButton label="All Notes" value="all" />
          <FilterButton label="Recent" value="recent" />
          <FilterButton label="Important" value="important" />
        </ScrollView>
      </View>

      {/* Notes List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notebook-outline" size={80} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No Notes Found</Text>
            <Text style={styles.emptyText}>
              Start documenting your observations and interactions with students
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddNote}
            >
              <Icon name="plus" size={20} color="#FFF" />
              <Text style={styles.emptyButtonText}>Add First Note</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.notesList}>
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add/Edit Note Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title Input */}
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter note title"
                placeholderTextColor="#95A5A6"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />

              {/* Category Selection */}
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                <CategoryButton label="General" value="general" icon="note-text" />
                <CategoryButton label="Behavioral" value="behavioral" icon="account-check" />
                <CategoryButton label="Academic" value="academic" icon="school" />
                <CategoryButton label="Emotional" value="emotional" icon="heart" />
              </View>

              {/* Content Input */}
              <Text style={styles.inputLabel}>Content</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Enter your observations and notes..."
                placeholderTextColor="#95A5A6"
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveNote}
                >
                  <Text style={styles.saveButtonText}>
                    {editingNote ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScrollContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#6C63FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D6D7E',
  },
  filterTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  notesList: {
    padding: 20,
  },
  noteCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  noteHeaderInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  noteStudent: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  noteHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteContent: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  noteDate: {
    fontSize: 12,
    color: '#95A5A6',
  },
  editText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 12,
  },
  titleInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  categoryButtonActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#5D6D7E',
    marginLeft: 6,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  contentInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#2C3E50',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5D6D7E',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default NotesScreen;