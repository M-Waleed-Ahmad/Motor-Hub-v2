import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this package installed
import { useRouter } from 'expo-router';

export default function ApproveUsers({ navigation }) {
  const router=useRouter();
  // Sample data for users
  const [users, setUsers] = useState([
    { id: '1', username: 'JohnDoe', cnic: '12345', status: 'Pending' },
    { id: '2', username: 'JaneSmith', cnic: '67890', status: 'Pending' },
    { id: '3', username: 'UserThree', cnic: '11111', status: 'Pending' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Handle search functionality
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

  // Approve and Reject button handlers
  const handleApprove = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'Approved' } : user
      )
    );
    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'Approved' } : user
      )
    );
  };

  const handleReject = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Adjust navigation as per your setup
        >
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approve Users</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userText}>Username: {item.username}</Text>
            <Text style={styles.userText}>CNIC: {item.cnic}</Text>
            <Text style={styles.userText}>Status: {item.status}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApprove(item.id)}
              >
                <Text style={styles.buttonText}>✔</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(item.id)}
              >
                <Text style={styles.buttonText}>✖</Text>
              </TouchableOpacity>
            </View>
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
    marginTop: 30, // Increased margin at the top
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    color: '#fff',
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  userCard: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  userText: {
    color: '#fff',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
