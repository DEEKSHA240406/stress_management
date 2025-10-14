import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import COLORS from '../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOW, Z_INDEX } from '../constants/_layout';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Modal = ({
  visible = false,
  onClose,
  title = '',
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'slide', // 'slide', 'fade', 'none'
  position = 'center', // 'center', 'bottom', 'top'
  size = 'medium', // 'small', 'medium', 'large', 'full'
  footer = null,
  headerIcon = null,
  backgroundColor = COLORS.WHITE,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  style = {},
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const showModal = () => {
    if (animationType === 'slide') {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    if (animationType === 'slide') {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress && onClose) {
      onClose();
    }
  };

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return styles.modalSmall;
      case 'large':
        return styles.modalLarge;
      case 'full':
        return styles.modalFull;
      default:
        return styles.modalMedium;
    }
  };

  const getModalPosition = () => {
    switch (position) {
      case 'top':
        return styles.modalTop;
      case 'bottom':
        return styles.modalBottom;
      default:
        return styles.modalCenter;
    }
  };

  const getAnimationStyle = () => {
    if (animationType === 'slide') {
      return { transform: [{ translateY: slideAnim }] };
    }
    return {};
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: backdropColor, opacity: fadeAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      <View
        style={[styles.modalContainer, getModalPosition()]}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modal,
              getModalSize(),
              { backgroundColor, opacity: fadeAnim },
              getAnimationStyle(),
              Platform.OS === 'web' ? { boxShadow: SHADOW.LG.boxShadow } : SHADOW.LG,
              style,
            ]}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  {headerIcon && <Text style={styles.headerIcon}>{headerIcon}</Text>}
                  {title && <Text style={styles.title}>{title}</Text>}
                </View>
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {/* Footer */}
            {footer && <View style={styles.footer}>{footer}</View>}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: Z_INDEX.MODAL_BACKDROP,
  },
  modalContainer: {
    flex: 1,
    zIndex: Z_INDEX.MODAL,
  },
  modalCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  modalBottom: {
    justifyContent: 'flex-end',
  },
  modalTop: {
    justifyContent: 'flex-start',
  },
  modal: {
    borderRadius: BORDER_RADIUS.XL,
    overflow: 'hidden',
  },
  modalSmall: {
    maxWidth: 300,
    maxHeight: '40%',
    width: '100%',
  },
  modalMedium: {
    maxWidth: 400,
    maxHeight: '70%',
    width: '100%',
  },
  modalLarge: {
    maxWidth: 600,
    maxHeight: '85%',
    width: '100%',
  },
  modalFull: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: SPACING.SM,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.GRAY_100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.SM,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.GRAY_600,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.XL,
  },
  footer: {
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
});

export default Modal;
