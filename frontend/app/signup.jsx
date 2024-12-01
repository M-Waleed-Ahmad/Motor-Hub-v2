import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
      Alert.alert('Sign Up Failed', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Sign Up Failed', 'Passwords do not match');
      return;
    }
  
    try {
      // Step 1: Fetch CSRF Token
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get('http://192.168.100.4:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      console.log('CSRF Token:', csrfToken);
      // Step 2: Make POST request with CSRF token
      const response = await axios.post(
        'http://192.168.100.4:8000/register', // Assuming this is the register endpoint
        {
          full_name: `${firstName} ${lastName}`,
          email,
          password,
          password_confirmation: confirmPassword,
          contact_number: contactNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );
  
      console.log('Sign Up Response:', response);
  
      if (response.status === 201) {
        Alert.alert('Sign Up Successful', 'Welcome to Motor Hub!');
      }
    } catch (error) {
      console.error('Sign Up Error:', error.response?.data || error);
      console.error('Sign Up Error:', error.response?.data || error);
      Alert.alert(
        'Sign Up Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };
  

  return (
    <ImageBackground
      source={require('../assets/images/login.png')} // Adjust the path as per your project structure
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Title Section */}
        <Text style={styles.title}>
          MOTOR <Text style={styles.highlight}>HUB</Text>
        </Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#ffffff"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#ffffff"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ffffff"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#ffffff"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Link href="/login" style={styles.link}>
              Log In
            </Link>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for better visibility
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 50,
    fontWeight: 'bold',
  },
  highlight: {
    color: '#00BFFF', // Blue highlight for "HUB"
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#ffffff',
  },
  signUpButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute', // Place footer at the bottom
    bottom: 30,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
  },
  link: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
