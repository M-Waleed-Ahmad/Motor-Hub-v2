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
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateListing = () => {
  const router = useRouter();
  const [isForSale, setIsForSale] = useState(true); // Toggle between Sale and Rent
  const [location, setLocation] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [registeredIn, setRegisteredIn] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('sedans'); // Default vehicle type
  const [isAuction, setIsAuction] = useState(false);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  // Vehicle types from the database
  const vehicleTypes = [
    'sedans',
    'suvs',
    'trucks',
    'bikes',
    'e-cars',
    'sports',
    'new',
    'used',
  ];

  const colors = [
    'Red',
    'Green',
    'Blue',
    'Black',
    'White',
    'Yellow',
    'Pink',
    'Orange',
    'Purple',
    'Brown',
    'Gray',
  ];

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image.');
      return;
    }
  
    const ListingData = new FormData();
    const userString= await AsyncStorage.getItem('user');
    let userId;
    if (userString) {
      const user = JSON.parse(userString); // Parse the string to get the user object
      userId = user.user_id; // Access the user_id from the user object
      console.log(userId); // Now you have the user_id
    } else {
      console.log("No user data found.");
    }
    // Append required fields
    ListingData.append('name', vehicleModel); // Match Laravel's field name
    ListingData.append('location', location || 'Unknown');
    ListingData.append('registeredIn', registeredIn || 'Unknown');
    ListingData.append('color', selectedColor || 'Unknown');
    ListingData.append('vehicle_type', selectedVehicleType);
    ListingData.append('bid', isAuction ? 'yes' : 'no');
    ListingData.append('listing_type', isForSale ? 'sale' : 'rent');
    ListingData.append('condition', 5); // Assuming a default value of 5
    ListingData.append('availability_status', 'available'); // Default status
    ListingData.append('price', isAuction ? 0 : price);
    ListingData.append('model', vehicleModel); // Assuming user ID is stored in AsyncStorage
    ListingData.append('user', userId); // Assuming user ID is stored in AsyncStorage
    // Attach the image
    const filename = image.split('/').pop();
    const fileType = filename.split('.').pop(); // e.g., jpg, png
    ListingData.append('image', {
      uri: image,
      name: filename,
      type: `image/${fileType}`,
    });
  
    try {
      // Fetch CSRF token
      const csrfResponse = await fetch('http://192.168.18.225:8000/csrf-token', {
        credentials: 'include', // Include cookies for Laravel Sanctum
      });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrf_token;
  
      // Send form data to the backend
      const response = await fetch('http://192.168.18.225:8000/vehicle-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: ListingData,
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Listing created successfully!');
        console.log('Listing created:', result.data.vehicle.vehicle_id);
        const vehicle_id=result.data.vehicle.vehicle_id;
        router.push(`/homeUser/listings/listingCreated/${vehicle_id}`); // Navigate back to the home screen
      } else {
        console.error('Error:', result);
        alert('Failed to create listing. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
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
        <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
          <Image
            source={
              image
                ? { uri: image }
                : require('../../../assets/images/image-placeholder.png')
            }
            style={styles.uploadedImage}
          />
          {!image && <Text style={styles.imageUploadText}>Tap to upload an image</Text>}
          <Text style={styles.supportText}>Supported Formats: JPG, JPEG, PNG</Text>
        </TouchableOpacity>

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

        <View style={styles.field}>
          <Text style={styles.fieldText}>Vehicle Type</Text>
          <Picker
            selectedValue={selectedVehicleType}
            onValueChange={(itemValue) => setSelectedVehicleType(itemValue)}
            style={styles.picker}
          >
            {vehicleTypes.map((type) => (
              <Picker.Item label={type} value={type} key={type} />
            ))}
          </Picker>
        </View>

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

        <View style={[styles.field, styles.auctionSection]}>
          <Text style={styles.fieldText}>Enable Auction?</Text>
          <Switch
            value={isAuction}
            onValueChange={() => setIsAuction(!isAuction)}
            thumbColor={isAuction ? '#1c8c1c' : '#cc0000'}
            trackColor={{ false: '#444', true: '#1c1c1c' }}
          />
        </View>

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
  picker: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    borderRadius: 8,
  },
});

export default CreateListing;
