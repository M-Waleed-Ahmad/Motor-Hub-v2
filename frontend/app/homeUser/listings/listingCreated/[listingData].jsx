import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {Link, useLocalSearchParams, useRouter } from 'expo-router';
const ListingCreated = () => {
  const userInfo={
    name: 'John Doe',
    phone: '123-456-7890',
    cnic: '12345-1234567-1',
  }
    const params = useLocalSearchParams();
  const rawListingData = params.listingData;  
  let listingData;
  
  try {
    // Parse the query string into an object
    const parseQueryString = (queryString) =>
      Object.fromEntries(new URLSearchParams(queryString).entries());
  
    listingData = parseQueryString(rawListingData);
    console.log("Parsed Listing Data:", listingData);
  } catch (error) {
    console.error("Error parsing listingData:", error);
    listingData = {}; // Fallback to an empty object if parsing fails
  }

  const imageUri = listingData.image;
  console.log("Image URI:", imageUri);
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
      <View style={styles.imageContainer}>
        <Image
          source={
          {uri:listingData.imageUri}
          }
          style={styles.image}
        />
      </View>

      {/* Created On */}
      <Text style={styles.createdOn}>Created on: {listingData.createdOn}</Text>

      {/* Listing Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>Location: {listingData.location}</Text>
        <Text style={styles.detailText}>Model: {listingData.model}</Text>
        <Text style={styles.detailText}>Price: {listingData.price}</Text>
        <Text style={styles.detailText}>Color: {listingData.color}</Text>

        {/* User Info */}
        <Text style={styles.sectionHeader}>Your Info:</Text>
        <Text style={styles.detailText}>👤 {userInfo.name}</Text>
        <Text style={styles.detailText}>📞 {userInfo.phone}</Text>
        <Text style={styles.detailText}>🆔 {userInfo.cnic}</Text>
      </View>

      {/* Listing Number */}
      <Text style={styles.listingNumber}>
        Listing Number: {listingData.listingNumber}
      </Text>
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
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#2c2c2c',
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
  sectionHeader: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  listingNumber: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ListingCreated;
