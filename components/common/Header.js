import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({
  title = '',
  subtitle = null,
  leftIcon = null,
  leftText = null,
  onLeftPress = null,
  rightIcon = null,
  rightText = null,
  onRightPress = null,
  showBorder = true,
  backgroundColor = '#FFFFFF',
  style = {},
}) => {
  return (
    <View style={[styles.container, showBorder && styles.border, { backgroundColor }, style]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {(leftIcon || leftText) && (
          <TouchableOpacity onPress={onLeftPress} style={styles.button}>
            {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
            {leftText && <Text style={styles.buttonText}>{leftText}</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {(rightIcon || rightText) && (
          <TouchableOpacity onPress={onRightPress} style={styles.button}>
            {rightText && <Text style={styles.buttonText}>{rightText}</Text>}
            {rightIcon && <Text style={styles.icon}>{rightIcon}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default Header;