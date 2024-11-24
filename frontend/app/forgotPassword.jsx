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

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Hook to navigate back

  const handleResetPassword = () => {
    if (email) {
      Alert.alert('Password Reset', 'A reset link has been sent to your email.');
    } else {
      Alert.alert('Error', 'Please enter a valid email address.');
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

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
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
