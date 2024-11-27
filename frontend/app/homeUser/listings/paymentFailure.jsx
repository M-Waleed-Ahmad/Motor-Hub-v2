import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const PaymentFailure = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error!</Text>
      <Text style={styles.info}>An error occurred. Payment could not be completed.</Text>
      <Text style={styles.infoNote}>Kindly check with your bank/card provider.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/homeUser/listings/paymentOptions')}>
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
    color: '#f44336',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  infoNote: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
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

export default PaymentFailure;
