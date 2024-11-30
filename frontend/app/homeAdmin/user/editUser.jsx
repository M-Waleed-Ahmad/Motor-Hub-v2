import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function EditUsers() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Users on Component Mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://192.168.18.225:8000/admin/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle User Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.full_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  // Handle User Update
  const handleConfirmChanges = async () => {
    if (!selectedUser) {
      Alert.alert('Error', 'No user selected for update.');
      return;
    }

    // Basic Form Validation
    if (!selectedUser.full_name || !selectedUser.email || !selectedUser.password) {
      Alert.alert('Validation Error', 'Please fill all the required fields.');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching CSRF Token...');
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);

      await axios.put(
        `http://192.168.18.225:8000/admin/users/${selectedUser.user_id}`,
      {
         full_name:selectedUser.full_name,
          email:selectedUser.email,
          password:selectedUser.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );

      // Update Local State
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === selectedUser.user_id ? selectedUser : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === selectedUser.user_id ? selectedUser : user
        )
      );

      Alert.alert('Success', 'User details updated successfully.');
      setSelectedUser(null); // Reset Form
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Update Error', 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Users</Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a user"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Error or Loading State */}
      {loading && <ActivityIndicator size="large" color="#4caf50" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => setSelectedUser(item)}
          >
            <Text style={styles.userText}>{item.full_name}</Text>
            <Text style={styles.userText}>{item.email}</Text>
            {item.profile_image && (
              <Image
                source={{ uri: item.profile_image_url }}
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>
        )}
      />

      {/* Edit Form */}
      {selectedUser && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={selectedUser.full_name || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, full_name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={selectedUser.email || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={selectedUser.password || ''}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, password: text })}
          />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmChanges}
          >
            <Text style={styles.buttonText}>Confirm Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1c1c1e',
    marginTop: 40,
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
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
