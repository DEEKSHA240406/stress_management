import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

const OptionButton = ({
  text = '',
  onPress,
  selected = false,
  disabled = false,
  index = 0,
  variant = 'default', // 'default', 'outlined', 'filled'
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation with staggered delay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    if (selected) {
      return {
        container: styles.selectedContainer,
        text: styles.selectedText,
      };
    }

    switch (variant) {
      case 'outlined':
        return {
          container: styles.outlinedContainer,
          text: styles.outlinedText,
        };
      case 'filled':
        return {
          container: styles.filledContainer,
          text: styles.filledText,
        };
      default:
        return {
          container: styles.defaultContainer,
          text: styles.defaultText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          styles.container,
          variantStyles.container,
          disabled && styles.disabled,
          style,
        ]}
      >
        <Text style={[styles.text, variantStyles.text]} numberOfLines={2}>
          {text}
        </Text>
        {selected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    minHeight: 60,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  // Default variant
  defaultContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  defaultText: {
    color: '#1F2937',
  },

  // Outlined variant
  outlinedContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  outlinedText: {
    color: '#6366F1',
  },

  // Filled variant
  filledContainer: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#EEF2FF',
  },
  filledText: {
    color: '#4F46E5',
  },

  // Selected state
  selectedContainer: {
    backgroundColor: '#6366F1',
    borderWidth: 2,
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },
});

export default OptionButton;