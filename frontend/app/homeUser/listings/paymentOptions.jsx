import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for the arrow icon

const PaymentOptions = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Arrow Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Text>  <Ionicons name="arrow-back" size={30} color="#fff" />
      </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>How would you like to purchase your product?</Text>

      {/* Payment Options */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/homeUser/listings/paymentDetails/debit_card')}
      >
        <Text style={styles.buttonText}>Cash</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/homeUser/listings/paymentDetails/credit_card')}
      >
        <Text style={styles.buttonText}>Credit Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/homeUser/listings/paymentDetails/bank_transfer')}
      >
        <Text style={styles.buttonText}>Online</Text>
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
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 50, // Make it circular
  },
  title: {
    fontSize: 30, // Increased font size for the title
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18, // Increased subtitle font size
    color: '#ccc',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2c2c2c',
    padding: 16, // Increased padding for bigger buttons
    borderRadius: 8,
    marginBottom: 16,
    width: '80%', // Keeping the width the same
    alignItems: 'center',
    minWidth: 200, // Ensures buttons are wide enough
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, // Increased font size
  },
});

export default PaymentOptions;
