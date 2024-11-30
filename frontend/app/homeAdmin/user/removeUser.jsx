import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RemoveUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [userId, setUser] = useState(null);
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const user = JSON.parse(userString);
        const userId = user.user_id;
        setUser(userId);
        const response = await axios.get('http://192.168.18.225:8000/admin/users');
        console.log('Users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users. Please try again.');
      }
    };
    fetchUsers();
  }, []);

  // Remove user
  const handleRemoveUser = async (userId) => {
    try {
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
  
      const response = await axios.delete(
        `http://192.168.18.225:8000/admin/users/${userId}`,
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== userId));
        Alert.alert('Success', 'User removed successfully.');
        router.replace(router.asPath); // Reload the page
      } else {
        Alert.alert('Error', 'Failed to remove the user. Please try again.');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remove Users</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email"
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      {/* User List */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          user.user_id !== userId && ( // Replace 'your_user_id' with the actual user ID
            <View key={user.user_id} style={styles.userCard}>
              <Image
                source={{
                  uri: user.profile_image_url || 'https://via.placeholder.com/50',
                }}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userType}>{user.user_type}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveUser(user.user_id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )
        ))
      ) : (
        <Text style={styles.noUsersText}>No users found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 15,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#aaa',
    fontSize: 14,
  },
  userType: {
    color: '#aaa',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  noUsersText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
