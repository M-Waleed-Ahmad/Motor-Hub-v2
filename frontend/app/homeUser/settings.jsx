import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomNav from '../../components/bottomNav'; // Import BottomNav component
import { BASE_URL } from '../../utils/config'; // Import the base URL

const SettingsScreen = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [openSections, setOpenSections] = useState({}); // Tracks which sections are open
  const router = useRouter();

  const settingsOptions = [
    { label: 'Location', icon: 'map-marker', content: 'Manage your location settings here.' },
    { label: 'Payment Method', icon: 'credit-card', content: 'Update your payment methods.' },
    { label: 'Passwords', icon: 'eye', content: 'Change your passwords securely.' },
    { label: 'Security', icon: 'lock', content: 'Adjust security settings.' },
    { label: 'About', icon: 'info-circle', content: 'Learn more about this app.' },
    { label: 'Help and Support', icon: 'headphones', content: 'Get help and support.' },
    { label: 'Rules of Service', icon: 'book', content: 'Read the rules of service.' },
  ];

  const handleToggleSection = (index) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the visibility of the section
    }));
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const response = await axios.post(`${BASE_URL}/logout`);

      console.log('Logout Response:', response.data);

      // Clear user token from AsyncStorage
      await AsyncStorage.removeItem('userToken');

      // Navigate to login page
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

  const fetchUnreadNotifications = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);

      if (user && user.unread_notifications_count !== undefined) {
        setUnreadNotifications(user.unread_notifications_count);
      } else {
        console.error('Unread notifications count not found in user object.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

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
          <View key={index}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => handleToggleSection(index)}
            >
              <FontAwesome
                name={option.icon}
                size={20}
                color="#aaa"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsLabel}>{option.label}</Text>
              <FontAwesome
                name={openSections[index] ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#aaa"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            {openSections[index] && (
              <View style={styles.dropdownContent}>
                <Text style={styles.dropdownText}>{option.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav unreadNotifications={unreadNotifications} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  header: {
    marginTop: 6,
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
  dropdownContent: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    marginTop: -8,
    marginBottom: 8,
    borderRadius: 8,
  },
  dropdownText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default SettingsScreen;
