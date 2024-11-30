import React from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddAdmin({ navigation }) {
  const router=useRouter();

  const handleAddAdmin = async () => {
    if (!fullName || !email || !password || !confirmPassword || !phoneNumber) {
      Alert.alert('Add Admin Failed', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Add Admin Failed', 'Passwords do not match');
      return;
    }
  
    try {
      // Step 1: Fetch CSRF Token
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get('http://192.168.18.193:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
  
      // Step 2: Make POST request with CSRF token
      const response = await axios.post(
        'http://192.168.18.193:8000/api/admins', // Replace with your actual add admin endpoint
        {
          full_name: fullName,
          email,
          password,
          phone_number: phoneNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );
  
      console.log('Add Admin Response:', response);
  
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Admin Added Successfully', 'A new admin has been added!');
      }
    } catch (error) {
      console.error('Add Admin Error:', error.response?.data || error);
      Alert.alert(
        'Add Admin Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Adjust navigation as per your setup
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Admin</Text>
      </View>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        placeholderTextColor="#aaa"
      />

      {/* Add Admin Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => console.log('Admin Added')}>
        <Text style={styles.buttonText}>Add Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1c1c1e',
    marginTop:30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
