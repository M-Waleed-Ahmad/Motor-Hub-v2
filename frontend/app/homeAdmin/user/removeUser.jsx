import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

export default function RemoveUsers() {
  const router = useRouter();

  const handleRemoveUser = async (userId) => {
    if (!userId) {
      Alert.alert('Error', 'User ID is required to remove a user.');
      return;
    }
  
    try {
      // Step 1: Fetch CSRF Token
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get('http://192.168.18225.136:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
  
      // Step 2: Make DELETE request with CSRF token
      const response = await axios.delete(
        `http://192.168.18.225:8000/api/users/${userId}`, // Replace with the correct endpoint
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );
  
      console.log('Remove User Response:', response);
  
      if (response.status === 200) {
        Alert.alert('User Removed Successfully', `User with ID ${userId} has been removed.`);
      } else {
        Alert.alert('Error', 'Failed to remove the user. Please try again.');
      }
    } catch (error) {
      console.error('Remove User Error:', error.response?.data || error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remove Users</Text>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        placeholderTextColor="#aaa"
      />

      {/* Remove User Button */}
      <TouchableOpacity style={styles.removeButton} onPress={() => console.log('User Removed')}>
        <Text style={styles.buttonText}>Remove User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1c1c1e',
    marginTop: 15, // Added margin at the top
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
  removeButton: {
    backgroundColor: '#f44336',
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
