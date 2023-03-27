import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Cell = ({ value, revealed, flagged, onPress, onLongPress }) => {
  const renderContent = () => {
    if (flagged) {
      return 'F';
    } else if (revealed) {
      return value === -1 ? 'B' : value === 0 ? ' ' : value;
    } else {
      return '';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
      <Text style={[styles.content, revealed && styles.revealed, flagged && styles.flagged]}>{renderContent()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#999',
  },
  content: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  revealed: {
    backgroundColor: '#fff',
  },
  flagged: {
    color: 'red',
  },
});

export default Cell;
