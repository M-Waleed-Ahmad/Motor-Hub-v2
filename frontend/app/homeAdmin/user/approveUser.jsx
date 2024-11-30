import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function ApproveUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.18.225:8000/admin/users');
        const data = await response.json();
        console.log('Users:', data);
        const unapprovedUsers = data.filter((user) => user.is_approved === '0');
        setUsers(data);
        setFilteredUsers(unapprovedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users. Please try again.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query.toLowerCase()) &&
          user.is_approved === '0'
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users.filter((user) => user.is_approved === '0'));
    }
  };

  const handleApprove = async (id) => {
    try {
      // Step 1: Fetch CSRF Token
      const csrfResponse = await fetch('http://192.168.18.225:8000/csrf-token', {
        credentials: 'include', // Send cookies with the request
      });
      const { csrf_token } = await csrfResponse.json(); // Ensure the response includes `csrf_token`
  
      // Step 2: Approve User
      const response = await axios.post(
        `http://192.168.18.225:8000/admin/users/approve/${id}`,
        {}, // No body needed
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token, // Pass CSRF token
            'X-Requested-With': 'XMLHttpRequest', // Laravel-specific header
          },
        }
      );
  
      // Step 3: Handle Successful Response
      Alert.alert('Success', 'User approved successfully.');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === id ? { ...user, is_approved: '1' } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== id)
      );
    } catch (error) {
      console.error('Error approving user:', error);
      Alert.alert('Error', 'Failed to approve user. Please try again.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approve Users</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.user_id)}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image
              source={{ uri: item.profile_image_url }}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userText}>Name: {item.full_name}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApprove(item.user_id)}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1c1c1e',
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    fontSize: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
  userText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  approveButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
});
