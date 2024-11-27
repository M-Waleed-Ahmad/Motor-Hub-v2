import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deal Was Successful</Text>
      <Text style={styles.info}>You will be notified of the confirmation of the deal.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/homeUser')}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PaymentSuccess;
