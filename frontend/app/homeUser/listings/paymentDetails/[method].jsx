import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for the back arrow

const PaymentDetails = () => {
  const router = useRouter();
  const { method } = useLocalSearchParams(); // Capture dynamic route parameter
  console.log(method);
  console.log(router);

  // Ensure method is available and handle case where it's undefined
  if (!method) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Payment Method Not Provided</Text>
      </View>
    );
  }

  // Dummy data for the buyer and seller information
  const buyer = {
    email: 'buyer@example.com',
    cnic: '12345-1234567-8',
    contact: '+92 300 1234567',
  };

  const seller = {
    email: 'seller@example.com',
    cnic: '98765-9876543-2',
    contact: '+92 300 7654321',
  };

  const handleConfirmPurchase = () => {
    const isSuccess = Math.random() > 0.5; // Simulate success or failure
    if (isSuccess) {
      router.push('/homeUser/listings/paymentSuccess');
    } else {
      router.push('/homeUser/listings/paymentFailure');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.info}>Payment Method: {method}</Text>

      {/* Display Buyer Information */}
      <Text style={styles.info}>Buyer Information:</Text>
      <Text style={styles.info}>Email: {buyer.email}</Text>
      <Text style={styles.info}>CNIC: {buyer.cnic}</Text>
      <Text style={styles.info}>Contact: {buyer.contact}</Text>

      {/* Display Seller Information */}
      <Text style={styles.info}>Seller Information:</Text>
      <Text style={styles.info}>Email: {seller.email}</Text>
      <Text style={styles.info}>CNIC: {seller.cnic}</Text>
      <Text style={styles.info}>Contact: {seller.contact}</Text>

      {/* Placeholder for Product Information */}
      <Text style={styles.info}>ID: xxxxxx</Text>
      <Text style={styles.info}>Model: XXX</Text>
      <Text style={styles.info}>Price: XXX</Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirmPurchase}>
        <Text style={styles.buttonText}>Confirm Purchase</Text>
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
    borderRadius: 50,
  },
  title: {
    fontSize: 30, // Increased font size for the title
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  info: {
    fontSize: 18, // Increased font size for better readability
    color: '#ccc',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2c2c2c',
    padding: 16, // Increased padding for bigger buttons
    borderRadius: 8,
    marginTop: 24,
    width: '80%',
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, // Increased font size for the button text
  },
});

export default PaymentDetails;
