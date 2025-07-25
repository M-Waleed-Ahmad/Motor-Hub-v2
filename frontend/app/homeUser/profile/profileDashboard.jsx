import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import BottomNav from '../../../components/bottomNav'; // Import the BottomNav component
import { BASE_URL } from '../../../utils/config'; // Import the base URL

export default function ProfilePage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [profile_image, setprofile_image] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);

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

  const fetchUserInfo = useCallback(async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        console.log('User info:', user);
        setUserInfo(user);
        setprofile_image(user.profile_image || null);
      } else {
        Alert.alert('Error', 'User not found. Please log in again.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert('Error', 'Unable to load user information.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const saveChanges = async () => {
    if (!tempValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      // Step 1: Fetch CSRF Token
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
  
    const response = await axios.post(`${BASE_URL}/updateProfile`, {
      user_id: userInfo.user_id,
      [editingField]: tempValue,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

      if (response.data.success) {
        Alert.alert('Success', `${editingField} updated successfully.`);
        const updatedUser = { ...userInfo, [editingField]: tempValue };
        setUserInfo(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setEditingField(null);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setprofile_image(imageUri);

      const formData = new FormData();
      formData.append('user_id', userInfo.user_id);
      formData.append('profile_image', {
        uri: imageUri,
        name: `profile_${userInfo.user_id}.jpg`,
        type: 'image/jpeg',
      });

      try {
        setLoading(true);
        // Step 1: Fetch CSRF Token
        console.log('Fetching CSRF Token...');
        const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
        const csrfToken = csrfResponse.data.csrf_token;
        console.log('CSRF Token:', csrfToken);
  
        const response = await axios.post(`${BASE_URL}/updateProfileImage`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
           },
        });

        if (response.data.success) {
          Alert.alert('Success', 'Profile image updated successfully.');
          const updatedUser = { ...userInfo, profile_image: imageUri };
          setUserInfo(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          Alert.alert('Error', 'Failed to update profile image.');
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        Alert.alert('Error', 'Unable to update profile image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [fetchUserInfo])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const editableFields = ['full_name', 'phone_number', 'email', 'address'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            {profile_image ? (
              <Image source={{ uri: profile_image }} style={styles.profile_image} />
            ) : (
              <FontAwesome name="user-circle" size={80} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={styles.username}>Profile</Text>
        </View>

        <View style={styles.infoCard}>
      {userInfo &&
        editableFields.map((field) => (
          <View key={field} style={styles.infoRow}>
            <FontAwesome
              name={
                field === 'full_name'
                  ? 'user'
                  : field === 'phone_number'
                  ? 'phone'
                  : field === 'email'
                  ? 'envelope'
                  : field === 'cnic'
                  ? 'id-card'
                  : 'home'
              }
              size={20}
              color="#fff"
            />
        {/* Use a mapping to display user-friendly labels */}
        <Text style={styles.infoText}>
          {field === 'phone_number'
            ? 'Phone'
            : field === 'full_name'
            ? 'Full Name'
            : field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
        </Text>
        {editingField === field ? (
          <TextInput
            style={styles.editInput}
            value={tempValue}
            onChangeText={setTempValue}
            autoFocus
            onBlur={saveChanges}
          />
        ) : (
          <Text style={styles.infoValue}>{userInfo[field]}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingField(field)}>
          <FontAwesome name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    ))}
</View>


        <View style={styles.buttonGrid}>
          <TouchableOpacity onPress={() => router.replace('/homeUser/profile/myRentals')} style={styles.navButton}>
            <Text style={styles.buttonText}>My Rentals</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/homeUser/profile/myFavs')} style={styles.navButton}>
            <Text style={styles.buttonText}>My Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/homeUser/profile/myListings')} style={styles.navButton}>
            <Text style={styles.buttonText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/homeUser/profile/myBids')} style={styles.navButton}>
            <Text style={styles.buttonText}>My Bids</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav unreadNotifications={unreadNotifications} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profile_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00b4d8',
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  infoValue: {
    color: '#aaa',
    fontSize: 16,
    flex: 2,
  },
  editInput: {
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#00b4d8',
    flex: 2,
    padding: 2,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 25,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
});
