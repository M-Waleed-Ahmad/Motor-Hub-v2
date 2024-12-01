import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const buttonSize = (width / 2) - 30; // Adjusting size dynamically

export default function ProfilePage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: 'Suneel Munj Lite',
    phone: 'XXXX-XXXXXXX',
    email: 'abc@gmail.com',
    cnic: 'XXXXX-XXXXXXX-X',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveChanges = () => {
    setUserInfo((prev) => ({ ...prev, [editingField]: tempValue }));
    setEditingField(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

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
          <Text style={styles.username}>Profile</Text>
        </View>

        <View style={styles.infoCard}>
          {Object.keys(userInfo).map((field) => (
            <View key={field} style={styles.infoRow}>
              <FontAwesome
                name={field === 'name' ? 'user' : field === 'phone' ? 'phone' : field === 'email' ? 'envelope' : 'id-card'}
                size={20}
                color="#fff"
              />
              <Text style={styles.infoText}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
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
              <TouchableOpacity onPress={() => startEditing(field, userInfo[field])}>
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

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Link href="/homeUser/profile">
            <FontAwesome name="user" size={30} color="#00b4d8" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/homeUser/listings/carListings">
            <FontAwesome name="car" size={30} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/homeUser/home">
            <FontAwesome name="home" size={30} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/homeUser/notifications">
            <FontAwesome name="bell" size={30} color="white" />
          </Link>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href="/homeUser/settings">
            <FontAwesome name="cog" size={30} color="white" />
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    width: buttonSize,
    height: buttonSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
});
