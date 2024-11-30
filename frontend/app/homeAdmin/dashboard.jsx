import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function AdminHomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.motor}>MOTOR </Text>
          <Text style={styles.hub}>HUB</Text>
        </Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.dashboardText}>Admin Dashboard</Text>
      </View>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="car" size={80} color="#00b4d8" />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/profile')}>
          <FontAwesome name="user" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/homeAdmin/user/main')}>
          <FontAwesome name="edit" size={25} color="white" />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={() => router.push('/homeAdmin/dashboard')}>
          <FontAwesome name="home" size={25} color="#00b4d8" />
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
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  motor: {
    color: '#00b4d8',
  },
  hub: {
    color: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    color: '#ccc',
    textAlign: 'center',
  },
  dashboardText: {
    fontSize: 18,
    color: '#aaa',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
  },
});
