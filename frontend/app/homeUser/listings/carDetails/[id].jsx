import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // to handle navigation and params
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';
const VehicleDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get vehicle ID from query params
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // State to track if the vehicle is in favorites
  const [isOwner, setIsOwner] = useState(false); // State to track if the user is the owner

  // Fetch vehicle details based on ID
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vehicle/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle details');
        }
        const data = await response.json();
        console.log('Fetched vehicle details:', data);
        setVehicle(data); // Set vehicle data

        // Check if the logged-in user is the owner
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        console.log('Logged-in user:', user.user_id);
        console.log('Vehicle owner:', data.owner);
        if (user.user_id === data.owner.user_id) {
          console.log('User is the owner of this vehicle');
          setIsOwner(true);
        }
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchVehicleDetails();
      checkFavoriteStatus();
    } // Only fetch if ID is provided
  }, [id]);

  // Function to navigate back
  const handleBackPress = () => {
    router.back();
  };

  // Handle button click for Buy or Bid
  const handleActionButton = async () => {
    await AsyncStorage.setItem('vehicle_id', id); // Store vehicle ID
    if (vehicle.bid === 'no') {
      await AsyncStorage.setItem('vehicle', JSON.stringify(vehicle)); // Store vehicle details
      router.push('/homeUser/listings/paymentOptions');
    } else if (vehicle.bid === 'yes') {
      router.push({ pathname: '/homeUser/listings/carBid', params: { vehicleName: vehicle.name } });
    } else {
      router.push('/homeUser/listings/carListings');
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const userString = await AsyncStorage.getItem('user'); // Get the logged-in user's ID
      const user = JSON.parse(userString);
      const userId = user.user_id;
      const response = await fetch(`${BASE_URL}/favourites?user_id=${userId}&vehicle_id=${id}`);
      const data = await response.json();
      console.log('Fetched favorite status:', data);
      setIsFavorite(data.is_favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const userId = user.user_id;
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`${BASE_URL}/favourites`, {
          params: {
            user_id: userId,
            vehicle_id: id,
          },
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(
          `${BASE_URL}/favourites`,
          {
            user_id: userId,
            vehicle_id: id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'X-Requested-With': 'XMLHttpRequest',
            },
          }
        );

        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      await axios.delete(`${BASE_URL}/vehicle/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      router.push('/homeUser/listings/carListings'); // Navigate back to listings after deletion
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load vehicle details.</Text>
      </View>
    );
  }

  // Render stars based on condition value
  const renderStars = (condition) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i < condition ? 'star' : 'star-o'}
          size={18}
          color="#FFD700"
          style={{ marginRight: 4 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Vehicle Image */}
      <Image source={{ uri: vehicle.images?.[0]?.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />

      {/* Vehicle Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{vehicle.name || 'Unknown Vehicle'}</Text>
        <View style={styles.ratingContainer}>{renderStars(vehicle.condition || 0)}</View>
        <Text style={styles.subtitle}>
          Condition: <Text style={styles.highlight}>{vehicle.condition || 'Not specified'}</Text>
        </Text>

        {/* Vehicle Info */}
        <Text style={styles.info}>Model: {vehicle.model || 'Not specified'}</Text>
        <Text style={styles.info}>Location: {vehicle.location || 'Not specified'}</Text>
        <Text style={styles.info}>Price: {vehicle.price ? `$${vehicle.price}` : 'Not available'}</Text>
        <Text style={styles.info}>Color: {vehicle.color || 'Not specified'}</Text>
        <Text style={styles.info}>Registered In: {vehicle.registeredIn || 'Not specified'}</Text>

        {/* Owner Info */}
        <Text style={styles.subtitle}>Owner's Info:</Text>
        <Text style={styles.info}>👤 {vehicle.owner.name || 'Unknown'}</Text>
        <Text style={styles.info}>📞 {vehicle.owner.phone || 'Not provided'}</Text>

        {/* Add to Favorites Button */}
        {!isOwner && (
          <TouchableOpacity onPress={toggleFavorite} style={styles.favButton}>
            <Text style={styles.favButtonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
          </TouchableOpacity>
        )}

        {/* Buy, Bid or Delete Button */}
        {isOwner ? (
          <TouchableOpacity onPress={handleDeleteVehicle} style={[styles.button, { backgroundColor: '#e74c3c' }]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        ) : vehicle.availability_status === 'sold' ? (
          <Text style={styles.soldText}>Sold</Text>
        ) : (
          <TouchableOpacity
            onPress={handleActionButton}
            style={[styles.button, { backgroundColor: vehicle.price ? '#3498db' : '#2ecc71' }]}
          >
            <Text style={styles.buttonText}>{vehicle.bid === 'no' ? 'Buy' : 'Bid'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#ff4444',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    zIndex: 10,
    backgroundColor: '#00000070',
    borderRadius: 50,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 15,
    marginVertical: 20,
  },
  detailsContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  highlight: {
    color: '#4caf50',
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 6,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  soldText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
  },
  favButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FF4081',
    alignItems: 'center',
  },
  favButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VehicleDetails;
