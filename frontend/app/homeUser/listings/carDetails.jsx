import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // to handle navigation
import Icon from 'react-native-vector-icons/Ionicons';

const VehicleDetails = () => {
  // Hardcoded vehicle data
  const vehicle = {
    name: "2019 Toyota Camry",
    condition: "Used",
    price: 10,
    model: "Camry XLE",
    location: "Los Angeles, CA",
    color: "White",
    registeredIn: "California",
    ownerName: "John Doe",
    ownerContact: "+1 234 567 890",
    image: "https://via.placeholder.com/150", // Use a valid image URL here
  };

  const router = useRouter();

  // Function to navigate back
  const handleBackPress = () => {
    router.back(); // Goes back to the previous screen
  };
  const handlebtn = () => {
    if (vehicle.price) {
      // Buy button
      // alert('Vehicle purchased successfully!');
      router.push('/homeUser/listings/paymentOptions');
    } else {
      // Bid button
      router.push('/homeUser/listings/carBid', { vehicleName: vehicle.name });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Vehicle Image */}
      <Image source={{ uri: vehicle.image }} style={styles.image} />

      {/* Vehicle Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{vehicle.name || 'Unknown Vehicle'}</Text>
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
        <Text style={styles.info}>👤 {vehicle.ownerName || 'Unknown'}</Text>
        <Text style={styles.info}>📞 {vehicle.ownerContact || 'Not provided'}</Text>

        {/* Buy or Bid Button */}
        <TouchableOpacity onPress={handlebtn} style={[styles.button, { backgroundColor: vehicle.price ? '#3498db' : '#2ecc71' }]}>
          <Text style={styles.buttonText}>{vehicle.price ? 'Buy' : 'Bid'}</Text>
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
    paddingTop: 50, // Adjust padding to make room for back button
  },
  backButton: {
    position: 'absolute',
    top: 30,  // Shifted down from the top
    left: 16,
    zIndex: 10,
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
});

export default VehicleDetails;
