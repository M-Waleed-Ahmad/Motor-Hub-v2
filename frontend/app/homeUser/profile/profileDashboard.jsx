import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <FontAwesome name="user-circle" size={80} color="#fff" />
          <Text style={styles.username}>Username</Text>
        </View>

        {/* User Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FontAwesome name="user" size={20} color="#fff" />
            <Text style={styles.infoText}>Name</Text>
            <Text style={styles.infoValue}>Suneel Munj Lite</Text>
            <TouchableOpacity>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={20} color="#fff" />
            <Text style={styles.infoText}>Phone No</Text>
            <Text style={styles.infoValue}>XXXX-XXXXXXX</Text>
            <TouchableOpacity>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="envelope" size={20} color="#fff" />
            <Text style={styles.infoText}>Email</Text>
            <Text style={styles.infoValue}>abc@gmail.com</Text>
            <TouchableOpacity>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="id-card" size={20} color="#fff" />
            <Text style={styles.infoText}>CNIC</Text>
            <Text style={styles.infoValue}>XXXXX-XXXXXXX-X</Text>
            <TouchableOpacity>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonGrid}>
            <View>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.buttonText}>My Rentals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.buttonText}>My Favourites</Text>
          </TouchableOpacity>
            </View>
            <View >
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.buttonText}>My Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.buttonText}>My Bids</Text>
          </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
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
        <TouchableOpacity >
          <Link href="homeUser/settings" style={styles.forgotText}>
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
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '50%',
  },
  navButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 40,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 25,
    width: '100%',
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
