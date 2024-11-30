import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BidPage = () => {
  const [vehicle, setVehicle] = useState(null); // Vehicle details state
  const [loading, setLoading] = useState(true); // Loading state
  const [bidAmount, setBidAmount] = useState(''); // Bid amount input
  const [userBid, setUserBid] = useState(null); // User's previous bid
  const [csrfToken, setCsrfToken] = useState(''); // CSRF Token
  const router = useRouter();

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://192.168.18.225:8000/csrf-token');
      const token = response.data.csrf_token;
      setCsrfToken(token);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      Alert.alert('Error', 'Failed to fetch CSRF token. Please try again.');
    }
  };

  // Fetch vehicle details and user's previous bid
  const fetchVehicleDetails = async () => {
    await fetchCsrfToken();

    try {
      const vehicleId = await AsyncStorage.getItem('vehicle_id'); // Get vehicle_id from AsyncStorage
      if (!vehicleId) {
        Alert.alert('Error', 'Vehicle ID not found in storage');
        router.back();
        return;
      }

      const userString = await AsyncStorage.getItem('user'); // Get user details from AsyncStorage
      if (!userString) {
        Alert.alert('Error', 'User not logged in');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userString);

      // Fetch vehicle details\
      console.log('Vehicle ID:', vehicleId);
      const response = await axios.get(`http://192.168.18.225:8000/vehicleBids`,
        {
          params: {
            user_id: user.user_id, // Pass user_id and vehicle_id as query parameters
            vehicle_id: vehicleId,
          },
          headers: {
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      const vehicleData = response.data;
      console.log('Vehicle details:', vehicleData);
      setVehicle(vehicleData);

    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      Alert.alert('Error', 'Unable to load vehicle details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle bid input change
  const handleBidChange = (text) => {
    setBidAmount(text);
  };

  // Submit or update bid
  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= vehicle.highestBid) {
      Alert.alert('Invalid Bid', 'Please enter a valid bid amount greater than the current highest bid.');
      return;
    }

    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);

      const response = await axios.post(
        'http://192.168.18.225:8000/bids',
        {
          vehicle_id: vehicle.vehicle_id,
          user_id: user.user_id,
          amount: parseFloat(bidAmount),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        }
      );

      Alert.alert('Success', 'Your bid has been placed successfully!');
      setBidAmount(''); // Reset bid input
      fetchVehicleDetails(); // Refresh vehicle details and user's bid
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Unable to place your bid. Please try again later.');
    }
  };

  // Fetch vehicle details on component mount
  useEffect(() => {
    fetchVehicleDetails();
  }, [csrfToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load vehicle details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <Image 
        source={{ uri: vehicle.images?.[0] || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />

      <Text style={styles.title}>{vehicle.model}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.highestBidText}>Highest Bid: {vehicle.highestBid} PKR</Text>
        <Text style={styles.info}>Total Bidders: {vehicle.totalBidders}</Text>
        {vehicle.userBid && <Text style={styles.info}>Your Previous Bid: {vehicle.userBid} PKR</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter your bid"
          keyboardType="numeric"
          value={bidAmount}
          onChangeText={handleBidChange}
          placeholderTextColor="#ccc"
        />

        <TouchableOpacity style={styles.button} disabled={!bidAmount} onPress={handleBidSubmit}>
          <Text style={styles.buttonText}>Submit Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 16, paddingTop: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { color: '#fff', marginTop: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  errorText: { color: '#ff4444' },
  backButton: { position: 'absolute', top: 30, left: 16, backgroundColor: '#00000070', borderRadius: 50, padding: 10 },
  image: { width: '100%', height: 250, resizeMode: 'cover', borderRadius: 15, marginVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginVertical: 16 },
  detailsContainer: { backgroundColor: '#2c2c2c', borderRadius: 10, padding: 16, marginTop: 20 },
  highestBidText: { fontSize: 24, color: '#4caf50', fontWeight: 'bold', marginBottom: 8 },
  info: { fontSize: 16, color: '#ccc', marginBottom: 8 },
  input: { backgroundColor: '#1c1c1c', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', marginTop: 16 },
  button: { marginTop: 16, backgroundColor: '#3498db', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default BidPage;
