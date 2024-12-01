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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios
import { BASE_URL } from '../utils/config'; // Ensure correct case

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Add state for password
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      console.log('Fetching CSRF Token...');
      console.log('Email:', BASE_URL);
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);

      await axios.post(
        `${BASE_URL}/forgot-password`, // Adjust endpoint if needed
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      Alert.alert('Success', 'Password reset successful. You can now log in with your new password.');
    } catch (error) {
      console.error('Error during password reset:', error);
      if (error.response) {
        // Server responded with a status other than 200 range
        Alert.alert('Error', `Failed to reset password: ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response received
        Alert.alert('Error', 'No response from server. Please try again later.');
      } else {
        // Something else happened
        Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
      }
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

        {/* Email Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input Field */}
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#ffffff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Hide the password input
        />

        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
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
  resetButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#555555',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgetPasswordScreen;
