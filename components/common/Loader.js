import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

const Loader = ({
  visible = false,
  text = 'Loading...',
  color = '#6366F1',
  size = 'large',
  overlay = true,
  fullScreen = false,
}) => {
  if (!visible) return null;

  const LoaderContent = (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={[styles.text, { color }]}>{text}</Text>}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={[styles.text, { color }]}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size={size} color={color} />
          {text && <Text style={[styles.text, { color }]}>{text}</Text>}
        </View>
      </View>
    );
  }

  return LoaderContent;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Loader;