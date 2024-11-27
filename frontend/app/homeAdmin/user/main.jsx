import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function UserManagementPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>User Management</Text>
      </View>

      {/* Options Grid */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/homeAdmin/user/addAdmin')}
        >
          <FontAwesome name="user-plus" size={40} color="#00b4d8" />
          <Text style={styles.optionText}>Add Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/homeAdmin/user/removeUser')}
        >
          <FontAwesome name="user-times" size={40} color="#00b4d8" />
          <Text style={styles.optionText}>Remove Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/homeAdmin/user/editUser')}
        >
          <FontAwesome name="edit" size={40} color="#00b4d8" />
          <Text style={styles.optionText}>Edit Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/homeAdmin/user/approveUser')}
        >
          <FontAwesome name="check-circle" size={40} color="#00b4d8" />
          <Text style={styles.optionText}>Approve Users</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Icon */}
      <View style={styles.bottomIconContainer}>
        <FontAwesome name="car" size={100} color="#00b4d8" />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user')}>
          <FontAwesome name="user" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/editUsers')}>
          <FontAwesome name="edit" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/dashboard')}>
          <FontAwesome name="home" size={25} color="#00b4d8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/items')}>
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
  header: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  optionCard: {
    backgroundColor: '#1E1E1E',
    width: '40%',
    height: 120,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  optionText: {
    color: '#ccc',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  bottomIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
  },
});
