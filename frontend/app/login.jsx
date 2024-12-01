import React, { useState } from 'react';
import { Link } from 'expo-router';
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
import { BASE_URL } from '../utils/config'; // Import the base URL

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'Email and password are required');
      return;
    }

    try {
      // Step 1: Fetch CSRF Token
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);

      // Step 2: Make POST request with CSRF token
      const response = await axios.post(
        `${BASE_URL}/login`, // Use the base URL
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // Step 3: Store the token in AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        if (user.user_type === 'admin') {
          await AsyncStorage.setItem('admin', JSON.stringify(user)); // Store user as a string
        } else {
          await AsyncStorage.setItem('user', JSON.stringify(user)); // Store user as a string
        }

        console.log('Login successful:', user);

        // Step 4: Navigate based on user type
        if (user.user_type === 'admin') {
          router.replace('/homeAdmin');
          console.log('Admin login successful');
        } else if (user.user_type === 'user') {
          router.replace('/homeUser');
          console.log('User login successful');
        } else {
          console.error('Unknown user type');
          Alert.alert('Error', 'Unknown user type.');
        }
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Title Section */}
        <Text style={styles.title}>
          MOTOR <Text style={styles.highlight}>HUB</Text>
        </Text>

        {/* Input Fields and Login Button */}
        <TextInput
          style={styles.input}
          placeholder="User Name"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.signupText}>
            Don't have an account? Want to{' '}
            <Link href="/signup" style={styles.link}>
              Sign Up
            </Link>
          </Text>
          <TouchableOpacity>
            <Link href="/forgotPassword" style={styles.forgotText}>
              Forgot Password?
            </Link>
          </TouchableOpacity>
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
    marginBottom: 70,

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
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
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
  signupText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
  },
  link: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#00BFFF',
    fontSize: 14,
    marginTop: 10,
  },
});

export default LoginScreen;
