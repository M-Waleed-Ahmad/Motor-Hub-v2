import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PaymentDetails = () => {
  const router = useRouter();
  const { method } = useLocalSearchParams();
  const [buyer, setBuyer] = useState(null); // For buyer information
  const [seller, setSeller] = useState(null); // For seller information
  const [vehicle, setVehicle] = useState(null); // For vehicle details
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user and vehicle data from AsyncStorage
        const userString = await AsyncStorage.getItem('user');
        const vehicleString = await AsyncStorage.getItem('vehicle');

        if (userString && vehicleString) {
          const user = JSON.parse(userString);
          const vehicle = JSON.parse(vehicleString);
          console.log('User:', user);
          console.log('Vehicle:', vehicle);
          setBuyer({
            user_id: user.user_id,
            name: user.full_name,
            phone: user.phone_number,
          });

          setSeller(vehicle.owner); // Assuming `owner` contains seller details
          setVehicle(vehicle);
        } else {
          Alert.alert('Error', 'Failed to fetch data from storage.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const makePayment = async () => {
    try {
      setLoading(true);

      // Fetch CSRF token
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
        'http://192.168.18.225:8000/make-payment',
        {
          payment_method:method,
          vehicle_id: vehicle.vehicle_id, // Assuming vehicle_id is in the vehicle object
          user_id: buyer.user_id, // Assuming buyer.user_id is set
          payment_for:vehicle.listing_type,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Include CSRF token in headers
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      // Handle successful payment
      Alert.alert('Success', 'Payment completed successfully!');
      router.push('/homeUser/listings/paymentSuccess');
    } catch (error) {
      console.error('Payment error:', error);

      // Handle payment failure
      const errorMessage =
        error.response?.data?.message || 'An error occurred while processing the payment.';
      Alert.alert('Payment Failed', errorMessage);
      router.push('/homeUser/listings/paymentFailure');
    } finally {
      setLoading(false);
    }
  };

  // Ensure all data is loaded before rendering
  if (!buyer || !seller || !vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

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
      <Text style={styles.info}>Name: {buyer.name}</Text>
      <Text style={styles.info}>Phone: {buyer.phone}</Text>

      {/* Display Seller Information */}
      <Text style={styles.info}>Seller Information:</Text>
      <Text style={styles.info}>Name: {seller.name}</Text>
      <Text style={styles.info}>Phone: {seller.phone}</Text>

      {/* Display Vehicle Information */}
      <Text style={styles.info}>Vehicle ID: {vehicle.vehicle_id}</Text>
      <Text style={styles.info}>Model: {vehicle.model}</Text>
      <Text style={styles.info}>Price: {vehicle.price}</Text>

      {/* Confirm Purchase Button */}
      <TouchableOpacity style={styles.button} onPress={makePayment} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Confirm Purchase'}</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2c2c2c',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    width: '80%',
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PaymentDetails;
