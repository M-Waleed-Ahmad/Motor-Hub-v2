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
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/config'; // Import the base URL

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const handleSignUp = async () => {
  //   if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
  //     Alert.alert('Sign Up Failed', 'All fields are required');
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     Alert.alert('Sign Up Failed', 'Passwords do not match');
  //     return;
  //   }
  
  //   try {
  //     // Step 1: Fetch CSRF Token
  //     console.log('Fetching CSRF Token...');
  //     const csrfResponse = await axios.get('http://192.168.18.193:8000/csrf-token');
  //     const csrfToken = csrfResponse.data.csrf_token;
  //     console.log('CSRF Token:', csrfToken);
  //     // Step 2: Make POST request with CSRF token
  //     const response = await axios.post(
  //       'http://192.168.18.193:8000/register', // Assuming this is the register endpoint
  //       {
  //         full_name: `${firstName} ${lastName}`,
  //         email,
  //         password,
  //         password_confirmation: confirmPassword,
  //         phone_number: contactNumber,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
  //           'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
  //         },
  //       }
  //     );
  
  //     console.log('Sign Up Response:', response);
  
  //     if (response.status === 201) {
  //       Alert.alert('Sign Up Successful', 'Welcome to Motor Hub!');
  //     }
  //   } catch (error) {
  //     console.error('Sign Up Error:', error.response?.data || error);
  //     Alert.alert(
  //       'Sign Up Failed',
  //       error.response?.data?.message || 'Something went wrong. Please try again.'
  //     );
  //   }
  // };
  
  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber) {
      Alert.alert('Sign Up Failed', 'All fields are required');
      return;
    }
  
    // Check if phone number length is exactly 11 digits
    const phoneNumberRegex = /^\d{11}$/; // Regex to ensure exactly 11 digits
    if (!phoneNumberRegex.test(contactNumber)) {
      Alert.alert('Sign Up Failed', 'Phone number must be exactly 11 digits');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Sign Up Failed', 'Please enter a valid email address');
      return;
    }

  

    if (!validateEmail(email)) {
      Alert.alert('Sign Up Failed', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Sign Up Failed', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Sign Up Failed', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
  
      // Step 2: Make POST request with CSRF token

      const response = await axios.post(
        `${BASE_URL}/register`,
        {
          full_name: `${firstName} ${lastName}`,
          email,
          password,
          password_confirmation: confirmPassword,
          phone_number: contactNumber,
          phone_number: contactNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      console.log('Sign Up Response:', response);

      if (response.status === 201) {
        Alert.alert('Sign Up Successful', 'Welcome to Motor Hub!');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setContactNumber('');
      }
    } catch (error) {
      console.error('Sign Up Error:', error.response?.data || error);
      Alert.alert(
        'Sign Up Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          MOTOR <Text style={styles.highlight}>HUB</Text>
        </Text>

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

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.signUpText}>SIGN UP</Text>
          )}
        </TouchableOpacity>

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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 50,
    fontWeight: 'bold',
  },
  highlight: {
    color: '#00BFFF',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    position: 'absolute',
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
