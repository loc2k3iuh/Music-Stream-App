import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const CustomAlert = ({ isVisible, content, onClose }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{content}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#181818',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#e1f6ea',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e1f6ea',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#181818',
  },
});

export default CustomAlert;