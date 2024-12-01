import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: "Test Heading", description: "This is a test Notification to see how the text will appear on the screen of a mobile phone whether it is an android or an iPhone." },
    { id: 2, title: "Test Heading", description: "This is a test Notification to see how the text will appear on the screen of a mobile phone whether it is an android or an iPhone." },
    // Add more notifications as needed
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationList}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription}>{notification.description}</Text>
            </View>
            <TouchableOpacity>
              <FontAwesome name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Link href="/homeUser/profile">
          <FontAwesome name="user" size={30} color="white" />
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
          <FontAwesome name="bell" size={30} color="#00b4d8" />
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
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1E1E1E',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#00b4d8',
    fontSize: 16,
  },
  notificationList: {
    flex: 1,
    padding: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  notificationText: {
    flex: 1,
    marginRight: 10,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationDescription: {
    color: '#aaa',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 10,
  },
});
