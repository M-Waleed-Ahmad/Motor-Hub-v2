import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const CreateListing = () => {
  const router = useRouter();
  const [isForSale, setIsForSale] = useState(true); // Toggle between Sale and Rent
  const [location, setLocation] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [registeredIn, setRegisteredIn] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAuction, setIsAuction] = useState(false);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);


  // Sample Color Palette (can be extended or replaced with library)
  const colors = [
    'Red', 'Green', 'Blue', 'Black', 'White', 
    'Yellow', 'Pink', 'Orange', 'Purple', 'Brown', 'Gray',
  ];

const handleImageUpload = async () => {
  // Request media library permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  // Launch the image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images
    allowsEditing: true, // Allow user to crop the image
    quality: 1, // Maximum quality
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri); // Save the selected image URI to state
  }
};
const handleSubmit = () => {
    // Create an object to store all the user-provided data
    const listingData = {
      isForSale,
      location,
      vehicleModel,
      registeredIn,
      selectedColor,
      isAuction,
      price: isAuction ? null : price, // Nullify price if auction is enabled
      image, // The image URI
    };
  
    // Serialize the object into a query string
    const queryString = new URLSearchParams(listingData).toString();
  
    // Navigate to the next page with query parameters
    router.push(`homeUser/listings/listingCreated/${queryString}`);
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.colorCircle,
        { backgroundColor: item.toLowerCase() },
        selectedColor === item && styles.selectedColor,
      ]}
      onPress={() => setSelectedColor(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add a Listing</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isForSale && styles.activeToggle]}
            onPress={() => setIsForSale(true)}
          >
            <Text style={styles.toggleText}>for sale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isForSale && styles.activeToggle]}
            onPress={() => setIsForSale(false)}
          >
            <Text style={styles.toggleText}>for rent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Image Upload Section */}
        <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
          <Image
            source={
              image
                ? { uri: image }
                : require('../../../assets/images/image-placeholder.png')
            }
            style={styles.uploadedImage}
          />
          {!image && (
            <Text style={styles.imageUploadText}>Tap to upload an image</Text>
          )}
          <Text style={styles.supportText}>Supported Formats: JPG, JPEG, PNG</Text>
        </TouchableOpacity>

        {/* Location Section */}
        <TouchableOpacity style={styles.field}>
          <Text style={styles.fieldText}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />
        </TouchableOpacity>

        {/* Vehicle Model Section */}
        <TouchableOpacity style={styles.field}>
          <Text style={styles.fieldText}>Vehicle Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter vehicle model"
            placeholderTextColor="#aaa"
            value={vehicleModel}
            onChangeText={setVehicleModel}
          />
        </TouchableOpacity>

        {/* Registered In Section */}
        <TouchableOpacity style={styles.field}>
          <Text style={styles.fieldText}>Registered In</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registration city"
            placeholderTextColor="#aaa"
            value={registeredIn}
            onChangeText={setRegisteredIn}
          />
        </TouchableOpacity>

        {/* Color Section */}
        <View style={styles.field}>
          <Text style={styles.fieldText}>Color</Text>
          <FlatList
            data={colors}
            horizontal
            keyExtractor={(item) => item}
            renderItem={renderColorItem}
            contentContainerStyle={styles.colorList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Auction Section */}
        <View style={[styles.field, styles.auctionSection]}>
          <Text style={styles.fieldText}>Enable Auction?</Text>
          <Switch
            value={isAuction}
            onValueChange={() => setIsAuction(!isAuction)}
            thumbColor={isAuction ? '#1c8c1c' : '#cc0000'}
            trackColor={{ false: '#444', true: '#1c1c1c' }}
          />
        </View>

        {/* Price Section */}
        <TouchableOpacity style={styles.field}>
          <Text style={styles.fieldText}>Price</Text>
          <TextInput
            style={[styles.input, isAuction && styles.disabledInput]}
            placeholder="Enter price"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            editable={!isAuction}
          />
          {isAuction && (
            <Text style={styles.disabledMessage}>
              Price field is disabled when auction is enabled
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Listing</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20, // Top padding for spacing
    paddingBottom: 20, // Bottom padding for spacing
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: '#2c2c2c',
  },
  activeToggle: {
    backgroundColor: '#1c1c1c',
  },
  toggleText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  imageUpload: {
    alignItems: 'center',
    marginVertical: 16,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#2c2c2c',
  },
  imageUploadText: {
    color: '#ccc',
    marginTop: 8,
  },
  supportText: {
    color: '#888',
    marginTop: 4,
  },
  field: {
    marginBottom: 16,
  },
  fieldText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2c2c2c',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
  },
  disabledInput: {
    backgroundColor: '#444',
  },
  disabledMessage: {
    color: '#888',
    marginTop: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorList: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2c2c2c',
  },
  selectedColor: {
    borderColor: '#fff',
  },
  auctionSection: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  submitButton: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateListing;
