import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({
  children,
  variant = 'body', // 'h1', 'h2', 'h3', 'body', 'caption', 'label'
  weight = 'regular', // 'light', 'regular', 'medium', 'semibold', 'bold'
  color = 'default', // 'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'muted'
  align = 'left', // 'left', 'center', 'right'
  numberOfLines = null,
  style = {},
  ...props
}) => {
  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default: // body
        return styles.body;
    }
  };

  // Get weight styles
  const getWeightStyles = () => {
    switch (weight) {
      case 'light':
        return styles.light;
      case 'medium':
        return styles.medium;
      case 'semibold':
        return styles.semibold;
      case 'bold':
        return styles.bold;
      default: // regular
        return styles.regular;
    }
  };

  // Get color styles
  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      case 'danger':
        return styles.danger;
      case 'muted':
        return styles.muted;
      default: // default
        return styles.defaultColor;
    }
  };

  // Get align styles
  const getAlignStyles = () => {
    switch (align) {
      case 'center':
        return styles.center;
      case 'right':
        return styles.right;
      default: // left
        return styles.left;
    }
  };

  const variantStyles = getVariantStyles();
  const weightStyles = getWeightStyles();
  const colorStyles = getColorStyles();
  const alignStyles = getAlignStyles();

  return (
    <Text
      style={[styles.base, variantStyles, weightStyles, colorStyles, alignStyles, style]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },

  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Weights
  light: {
    fontWeight: '300',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },

  // Colors
  defaultColor: {
    color: '#1F2937',
  },
  primary: {
    color: '#6366F1',
  },
  secondary: {
    color: '#9CA3AF',
  },
  success: {
    color: '#10B981',
  },
  warning: {
    color: '#F59E0B',
  },
  danger: {
    color: '#EF4444',
  },
  muted: {
    color: '#6B7280',
  },

  // Align
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

export default CustomText;