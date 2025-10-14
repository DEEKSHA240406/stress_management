import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const StatsCard = ({
  title = '',
  value = 0,
  icon = '📊',
  subtitle = '',
  trend = null, // 'up', 'down', 'neutral'
  trendValue = null,
  color = '#6366F1',
  backgroundColor = '#EEF2FF',
  onPress = null,
  showTrend = false,
  valuePrefix = '',
  valueSuffix = '',
  size = 'medium', // 'small', 'medium', 'large'
  style = {},
}) => {
  // Get trend display
  const getTrendDisplay = () => {
    if (!showTrend || !trend) return null;

    let trendIcon = '';
    let trendColor = '';

    switch (trend) {
      case 'up':
        trendIcon = '↗';
        trendColor = '#10B981';
        break;
      case 'down':
        trendIcon = '↘';
        trendColor = '#EF4444';
        break;
      case 'neutral':
        trendIcon = '→';
        trendColor = '#6B7280';
        break;
      default:
        trendIcon = '→';
        trendColor = '#6B7280';
    }

    return { trendIcon, trendColor };
  };

  const trendDisplay = getTrendDisplay();

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          iconContainer: styles.smallIconContainer,
          icon: styles.smallIcon,
          title: styles.smallTitle,
          value: styles.smallValue,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          iconContainer: styles.largeIconContainer,
          icon: styles.largeIcon,
          title: styles.largeTitle,
          value: styles.largeValue,
        };
      default: // medium
        return {
          container: styles.mediumContainer,
          iconContainer: styles.mediumIconContainer,
          icon: styles.mediumIcon,
          title: styles.mediumTitle,
          value: styles.mediumValue,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const CardContent = (
    <View style={[styles.container, sizeStyles.container, style]}>
      {/* Icon Container */}
      <View style={[styles.iconContainer, sizeStyles.iconContainer, { backgroundColor }]}>
        <Text style={[styles.icon, sizeStyles.icon]}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={[styles.title, sizeStyles.title]} numberOfLines={1}>
          {title}
        </Text>

        {/* Value */}
        <View style={styles.valueContainer}>
          <Text style={[styles.value, sizeStyles.value, { color }]}>
            {valuePrefix}{value}{valueSuffix}
          </Text>

          {/* Trend Indicator */}
          {showTrend && trendDisplay && (
            <View style={[styles.trendBadge, { backgroundColor: trendDisplay.trendColor + '20' }]}>
              <Text style={[styles.trendIcon, { color: trendDisplay.trendColor }]}>
                {trendDisplay.trendIcon}
              </Text>
              {trendValue && (
                <Text style={[styles.trendValue, { color: trendDisplay.trendColor }]}>
                  {trendValue}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Subtitle */}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Arrow for clickable cards */}
      {onPress && (
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </View>
  );

  // Return touchable or regular view based on onPress
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  
  // Size variants - Container
  smallContainer: {
    padding: 12,
  },
  mediumContainer: {
    padding: 16,
  },
  largeContainer: {
    padding: 20,
  },

  // Icon Container
  iconContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  smallIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  mediumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  largeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },

  // Icon
  icon: {
    textAlign: 'center',
  },
  smallIcon: {
    fontSize: 20,
  },
  mediumIcon: {
    fontSize: 24,
  },
  largeIcon: {
    fontSize: 28,
  },

  // Content
  content: {
    flex: 1,
  },

  // Title
  title: {
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 12,
  },
  mediumTitle: {
    fontSize: 13,
  },
  largeTitle: {
    fontSize: 14,
  },

  // Value Container
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  // Value
  value: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  smallValue: {
    fontSize: 20,
  },
  mediumValue: {
    fontSize: 24,
  },
  largeValue: {
    fontSize: 28,
  },

  // Trend Badge
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 2,
  },
  trendValue: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Subtitle
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Arrow
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
  },
});

export default StatsCard;