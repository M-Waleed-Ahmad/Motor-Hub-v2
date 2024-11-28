import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

const ListingCreated = () => {
  const { listingData: vehicle_id } = useLocalSearchParams(); // Extract vehicle_id from params
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true); // Track image loading state

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        // Fetch vehicle details from backend
        const response = await fetch(`http://192.168.18.225:8000/vehicle/${vehicle_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing data');
        }
        const data = await response.json();
        setListingData(data);
      } catch (error) {
        console.error('Error fetching listing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [vehicle_id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading listing details...</Text>
      </View>
    );
  }

  if (!listingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load listing details.</Text>
        <Link href="/homeUser">
          <TouchableOpacity>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  const {
    name,
    location,
    registeredIn,
    color,
    vehicle_type,
    price,
    images,
    created_at: createdOn,
  } = listingData;

  const imageUri = images?.[0]?.image_url || null; // Use the first image URL

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/homeUser">
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>Listing Created</Text>
      </View>

      {/* Image Section */}
      {imageUri ? (
        <View style={styles.imageContainer}>
          {/* Show the loader when the image is loading */}
          {imageLoading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#00BFFF" />
            </View>
          )}
          {/* Image */}
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, imageLoading && styles.imageLoadingPlaceholder]} // Add placeholder style when loading
            onLoadStart={() => setImageLoading(true)} // Trigger loader when the image starts loading
            onLoadEnd={() => setImageLoading(false)} // Stop loader when the image finishes loading
          />
        </View>
      ) : (
        <Text style={styles.noImageText}>No image available</Text>
      )}
      {/* Created On */}
      <Text style={styles.createdOn}>Created on: {new Date(createdOn).toLocaleString()}</Text>

      {/* Listing Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>Location: {location}</Text>
        <Text style={styles.detailText}>Model: {name}</Text>
        <Text style={styles.detailText}>Price: {price}</Text>
        <Text style={styles.detailText}>Color: {color}</Text>
        <Text style={styles.detailText}>Vehicle Type: {vehicle_type}</Text>
        <Text style={styles.detailText}>Registered In: {registeredIn}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#2c2c2c',
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }], // Center the loader
  },
  noImageText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  createdOn: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  backLink: {
    color: '#00BFFF',
    fontSize: 16,
    marginTop: 16,
  },
  imageLoadingPlaceholder: {
    backgroundColor: '#444', // Placeholder color while loading
  },  
  loaderOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for loading
    borderRadius: 8, // Matches the image border
  },
  
});

export default ListingCreated;
