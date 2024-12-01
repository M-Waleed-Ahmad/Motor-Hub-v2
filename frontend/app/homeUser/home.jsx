import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../components/bottomNav'; // Import the BottomNav component

const { width } = Dimensions.get('window');
import {useRouter} from 'expo-router'

const MotorHubScreen = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const bannerImages = [ 
    require('../../assets/images/banner1.jpg'), // Replace with your actual image paths
    require('../../assets/images/banner1.jpg'), // Replace with your actual image paths
    require('../../assets/images/banner1.jpg'), // Replace with your actual image paths
  ];
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();
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

    // Auto-scroll the carousel every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const renderBannerImage = ({ item }) => (
    <Image
      source={item} // Pass the item directly
      style={styles.banner}
      resizeMode="cover"
    />
  );
  
  const handleCategorySelect = async (category) => {
    try {
      console.log('Selected category:', category);
      await AsyncStorage.setItem('selectedCategory', category);
      router.push('/homeUser/listings'); // Navigate to Product Listings page
    } catch (error) {
      console.error('Error storing category:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          <Text style={{ color: '#00b4d8' }}>MOTOR </Text>HUB
        </Text>
      </View>

    

      {/* Advertisement Banner (Auto-Rotating Carousel) */}
      <FlatList
        ref={flatListRef}
        data={bannerImages}
        renderItem={renderBannerImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / width);
          setCurrentIndex(newIndex);
        }}
      />

      {/* Create New Listing Button */}
      <TouchableOpacity
        style={styles.createListingButton}
        onPress={() => router.push(('/homeUser/listings/createNewListing'))}
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
          <TouchableOpacity onPress={() => handleCategorySelect(category.label)} key={index} style={styles.categoryItem}>
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
    marginTop: 30,
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
    width,
    height: 250,
    marginVertical: 16,
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
