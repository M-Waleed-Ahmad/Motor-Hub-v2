import React, { useState, useCallback } from 'react';
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

export default function AdminProfilePage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAdminInfo = useCallback(async () => {
    try {
      const userString = await AsyncStorage.getItem('admin');
      if (userString) {
        const admin = JSON.parse(userString);
        setUserInfo(admin);
        setProfileImage(admin.profile_image || null);
      } else {
        Alert.alert('Error', 'Admin not found. Please log in again.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
      Alert.alert('Error', 'Unable to load admin information.');
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
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
        'http://192.168.18.225:8000/updateAdminProfile',
        {
          user_id: userInfo.user_id,
          [editingField]: tempValue,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', `${editingField} updated successfully.`);
        const updatedAdmin = { ...userInfo, [editingField]: tempValue };
        setUserInfo(updatedAdmin);
        await AsyncStorage.setItem('admin', JSON.stringify(updatedAdmin));
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
      setProfileImage(imageUri);

      const formData = new FormData();
      formData.append('user_id', userInfo.user_id);
      formData.append('profile_image', {
        uri: imageUri,
        name: `profile_${userInfo.admin_id}.jpg`,
        type: 'image/jpeg',
      });

      try {
        setLoading(true);
        const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
        const csrfToken = csrfResponse.data.csrf_token;

        const response = await axios.post(
          'http://192.168.18.225:8000/updateAdminProfileImage',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRF-TOKEN': csrfToken,
              'X-Requested-With': 'XMLHttpRequest',
            },
          }
        );

        if (response.data.success) {
          Alert.alert('Success', 'Profile image updated successfully.');
          const updatedAdmin = { ...userInfo, profile_image: imageUri };
          setUserInfo(updatedAdmin);
          await AsyncStorage.setItem('admin', JSON.stringify(updatedAdmin));
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
      fetchAdminInfo();
    }, [fetchAdminInfo])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const editableFields = ['full_name', 'email', 'phone_number', 'address'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <FontAwesome name="user-circle" size={80} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={styles.username}>Admin Profile</Text>
        </View>

        <View style={styles.infoCard}>
          {userInfo &&
            editableFields.map((field) => (
              <View key={field} style={styles.infoRow}>
                <FontAwesome
                  name={
                    field === 'full_name'
                      ? 'user'
                      : field === 'email'
                      ? 'envelope'
                      : field === 'phone_number'
                      ? 'phone'
                      : 'home'
                  }
                  size={20}
                  color="#fff"
                />
                <Text style={styles.infoText}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
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
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/profile')}>
          <FontAwesome name="user" size={25} color="#00b4d8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/main')}>
          <FontAwesome name="edit" size={25} color="white" />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => router.push('/homeAdmin/dashboard')}>
          <FontAwesome name="home" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/carListings')}>
          <FontAwesome name="bar-chart" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/settings')}>
          <FontAwesome name="cog" size={25} color="white" />
        </TouchableOpacity>
      </View>
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
  profileImage: {
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
  },
});
