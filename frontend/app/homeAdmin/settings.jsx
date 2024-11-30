import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SettingsScreen = () => {
  const settingsOptions = [
    { label: 'Location', icon: 'map-marker' },
    { label: 'Payment Method', icon: 'credit-card' },
    { label: 'Passwords', icon: 'eye' },
    { label: 'Security', icon: 'lock' },
    { label: 'About', icon: 'info-circle' },
    { label: 'Help and Support', icon: 'headphones' },
    { label: 'Rules of Service', icon: 'book' },
  ];
  const router = useRouter();
  const handleLogout = async () => {
    const router = useRouter();
  
    try {
      // Step 1: Make a POST request to the logout endpoint
      console.log('Logging out...');
      const response = await axios.post('http://192.168.18.225:8000/logout');
  
      console.log('Logout Response:', response.data);
  
      // Step 2: Clear the user token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
  
      // Step 3: Navigate to the login page
      router.replace('/login');
      Alert.alert('Logout Successful', 'You have been logged out.');
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error);
      Alert.alert(
        'Logout Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.settingsList}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.settingsItem}>
            <FontAwesome
              Name={option.icon}
              size={20}
              color="#aaa"
              style={styles.settingsIcon}
            />
            <Text style={styles.settingsLabel}>{option.label}</Text>
            <FontAwesome
              name="chevron-right"
              size={16}
              color="#aaa"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/profile')}>
          <FontAwesome name="user" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/main')}>
          <FontAwesome name="edit" size={25} color="white" />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => router.push('/homeAdmin/dashboard')}>
          <FontAwesome name="home" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/carListings')}>
          <FontAwesome name="bar-chart" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/settings')}>
          <FontAwesome name="cog" size={25} color="#00b4d8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  header: {
    marginTop:6,
    backgroundColor: '#121212',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 16,
  },
  logoutText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsList: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  settingsIcon: {
    marginRight: 15,
  },
  settingsLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
  },
});

export default SettingsScreen;