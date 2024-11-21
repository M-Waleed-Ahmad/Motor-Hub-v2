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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'test@example.com' && password === 'password') {
      Alert.alert('Login Successful');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login.png')}
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
            <Text style={styles.link}>SIGN UP</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for better visibility
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 70,

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
    position: 'absolute', // Place footer at the bottom
    bottom: 30, // Distance from the bottom of the screen
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  signupText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10, // Add spacing between "Sign Up" and "Forgot Password"
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
