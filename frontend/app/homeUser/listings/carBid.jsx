import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const BidPage = () => {
  const vehicle = {
    name: "2019 Toyota Camry",
    condition: "Used",
    price: 0,
    model: "Camry XLE",
    location: "Los Angeles, CA",
    color: "White",
    registeredIn: "California",
    ownerName: "John Doe",
    ownerContact: "+1 234 567 890",
    image: "https://via.placeholder.com/150", // Use a valid image URL here
  };
  
  const [bidAmount, setBidAmount] = useState('');
  const router = useRouter();

  // Handle the bid input change
  const handleBidChange = (text) => {
    setBidAmount(text);
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Vehicle Image */}
      <Image source={{ uri: vehicle.image }} style={styles.image} />

      {/* Vehicle Name */}
      <Text style={styles.title}>{vehicle.name}</Text>

      {/* Bid Info */}
      <View style={styles.detailsContainer}>
        <Text style={styles.highestBidText}>Highest Bidder: 1 PKR</Text>
        <Text style={styles.info}>Total Bidders: 100</Text>
        <Text style={styles.info}>Bidding Starts At: 0.5 PKR</Text>

        {/* Bid Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your bid"
          keyboardType="numeric"
          value={bidAmount}
          onChangeText={handleBidChange}
          placeholderTextColor="#ccc"
        />

        {/* Bid Button */}
        <TouchableOpacity style={styles.button} disabled={!bidAmount}>
          <Text style={styles.buttonText}>Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 30,  // Shifted down slightly for better positioning
    left: 16,
    backgroundColor: '#00000070',  // Slight background for visibility
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 16,
  },
  detailsContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  highestBidText: {
    fontSize: 24, // Largest text
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BidPage;
