// app/components/mentor/NoteCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NoteCard = ({ 
  note, 
  onPress, 
  onEdit, 
  onDelete,
  showActions = true
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today at ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'Yesterday at ' + date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days < 7) {
      return days + ' days ago';
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
      case 'academic':
        return '#2196F3';
      case 'behavioral':
        return '#FF6B9D';
      case 'health':
        return '#4CAF50';
      case 'emotional':
        return '#9C27B0';
      case 'social':
        return '#FF9800';
      default:
        return '#95A5A6';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        note.isImportant && styles.importantCard
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: note.isImportant ? '#FFA726' : '#6C63FF' + '15' }
          ]}>
            <Icon 
              name={note.isImportant ? 'star' : 'note-text'} 
              size={18} 
              color={note.isImportant ? '#FFF' : '#6C63FF'} 
            />
          </View>
          <View style={styles.headerInfo}>
            {note.studentName && (
              <Text style={styles.studentName}>{note.studentName}</Text>
            )}
            <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity 
                onPress={() => onEdit(note)} 
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="pencil" size={18} color="#6C63FF" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity 
                onPress={() => onDelete(note)} 
                style={styles.actionButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="delete" size={18} color="#D32F2F" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Title */}
      {note.title && (
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
      )}

      {/* Content */}
      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Category */}
        {note.category && (
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(note.category) + '15' }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: getCategoryColor(note.category) }
            ]}>
              {note.category}
            </Text>
          </View>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Icon name="tag-multiple" size={12} color="#95A5A6" />
            <Text style={styles.tagsText}>
              {note.tags.slice(0, 2).join(', ')}
              {note.tags.length > 2 && ' +' + (note.tags.length - 2)}
            </Text>
          </View>
        )}
      </View>

      {/* Attachment indicator */}
      {note.hasAttachment && (
        <View style={styles.attachmentIndicator}>
          <Icon name="paperclip" size={12} color="#7F8C8D" />
          <Text style={styles.attachmentText}>Attachment</Text>
        </View>
      )}

      {/* Important flag */}
      {note.isImportant && (
        <View style={styles.importantFlag}>
          <Icon name="flag" size={16} color="#FFA726" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#E8E8E8',
  },
  importantCard: {
    borderLeftColor: '#FFA726',
    backgroundColor: '#FFFBF0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#95A5A6',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
  },
  content: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsText: {
    fontSize: 11,
    color: '#95A5A6',
    marginLeft: 4,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachmentText: {
    fontSize: 11,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  importantFlag: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default NoteCard;