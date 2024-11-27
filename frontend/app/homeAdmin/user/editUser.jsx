import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ensure this package is installed
import { useRouter } from 'expo-router';
export default function EditUsers({ navigation }) {
  const router= useRouter();
  // Sample data for demonstration
  const [users, setUsers] = useState([
    { id: '1', username: 'JohnDoe', password: 'password123', cnic: '12345' },
    { id: '2', username: 'JaneSmith', password: 'mypassword', cnic: '67890' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  // Function to populate form with selected user's data
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Function to update user details
  const handleConfirmChanges = () => {
    console.log('Updated User Details:', selectedUser);
    // Update logic here
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Adjust navigation logic as per your setup
        >
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

      {/* List of Search Results */}
      {filteredUsers.length > 0 && (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserSelect(item)}
            >
              <Text style={styles.userText}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Form to Edit Selected User */}
      {selectedUser && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={selectedUser.username}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={(text) => setSelectedUser({ ...selectedUser, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="CNIC"
            placeholderTextColor="#aaa"
            value={selectedUser.cnic}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, cnic: text })}
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
    marginTop:40,
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
  userItem: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
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
