// app/components/mentor/AlertBadge.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AlertBadge = ({ 
  type = 'info', 
  count = 0, 
  size = 'medium',
  onPress,
  showCount = true
}) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'critical':
        return { 
          color: '#D32F2F', 
          icon: 'alert-circle', 
          label: 'Critical',
          bgColor: '#FFEBEE'
        };
      case 'high':
        return { 
          color: '#F57C00', 
          icon: 'alert', 
          label: 'High',
          bgColor: '#FFF3E0'
        };
      case 'medium':
        return { 
          color: '#FBC02D', 
          icon: 'alert-outline', 
          label: 'Medium',
          bgColor: '#FFFDE7'
        };
      case 'low':
        return { 
          color: '#388E3C', 
          icon: 'information', 
          label: 'Low',
          bgColor: '#E8F5E9'
        };
      case 'info':
      default:
        return { 
          color: '#2196F3', 
          icon: 'information-outline', 
          label: 'Info',
          bgColor: '#E3F2FD'
        };
    }
  };

  const config = getAlertConfig();
  
  const sizeConfig = {
    small: {
      container: { paddingHorizontal: 10, paddingVertical: 6 },
      icon: 14,
      label: 11,
      count: 10,
      countBadge: { width: 16, height: 16, top: -6, right: -6 },
    },
    medium: {
      container: { paddingHorizontal: 14, paddingVertical: 8 },
      icon: 18,
      label: 13,
      count: 11,
      countBadge: { width: 20, height: 20, top: -8, right: -8 },
    },
    large: {
      container: { paddingHorizontal: 18, paddingVertical: 10 },
      icon: 22,
      label: 15,
      count: 12,
      countBadge: { width: 24, height: 24, top: -10, right: -10 },
    },
  };

  const currentSize = sizeConfig[size];

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[
        styles.container, 
        currentSize.container,
        { backgroundColor: config.bgColor }
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Icon name={config.icon} size={currentSize.icon} color={config.color} />
      
      {showCount && count > 0 && (
        <View style={[
          styles.countBadge, 
          currentSize.countBadge,
          { backgroundColor: config.color }
        ]}>
          <Text style={[styles.countText, { fontSize: currentSize.count }]}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
      
      <Text style={[
        styles.label, 
        { color: config.color, fontSize: currentSize.label }
      ]}>
        {config.label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  countBadge: {
    position: 'absolute',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  countText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AlertBadge;