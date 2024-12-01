import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/bottomNav'; // Import the BottomNav component

const MotorHubScreen = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Fetch unread notifications count from AsyncStorage
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
        <Text style={styles.logo}>
          <Text style={{ color: '#00b4d8' }}>MOTOR </Text>HUB
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="bars" size={24} color="white" style={styles.menuIcon} />
        <TextInput
          placeholder="Hinted search text"
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity>
          <FontAwesome name="search" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Advertisement Banner */}
      <Image
        source={{
          uri: 'https://via.placeholder.com/350x150', // Replace with your actual image URL
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Create New Listing Button */}
      <TouchableOpacity
        style={styles.createListingButton}
        onPress={() => console.log('Navigate to Create New Listing')}
      >
        <Text style={styles.createListingText}>Create New Listing</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {[
          { label: 'Sedans', icon: '🚗' },
          { label: 'SUVs', icon: '🚙' },
          { label: 'Trucks', icon: '🚚' },
          { label: 'Bikes', icon: '🏍' },
          { label: 'E-Cars', icon: '⚡' },
          { label: 'Sports', icon: '🏎' },
          { label: 'New', icon: '🆕' },
          { label: 'Used', icon: '♻' },
        ].map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <BottomNav unreadNotifications={unreadNotifications} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#121212',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    marginTop: 11,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 16,
    padding: 10,
    borderRadius: 10,
  },
  menuIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  banner: {
    width: '90%',
    height: 150,
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 10,
  },
  createListingButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  createListingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 10,
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 30,
    color: '#fff',
  },
  categoryLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default MotorHubScreen;
