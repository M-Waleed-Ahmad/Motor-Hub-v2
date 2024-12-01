import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const userId = user?.user_id;

      if (!userId) {
        console.error('User ID not found in AsyncStorage');
        setLoading(false);
        return;
      }

      console.log('Fetching notifications for user ID:', userId);
      const response = await axios.get(
        `http://192.168.18.225:8000/notifications?user_id=${userId}`
      );
      console.log('Notifications:', response.data); 
      const sortedNotifications = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const userId = user?.user_id;
      console.log('Clearing all notifications for user ID:', userId);
      console.log('CSRF Token:', csrfToken);
      await axios.post(`http://192.168.18.225:8000/notifications/clear-all`,
        {
          user_id: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {

      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      await axios.post(
        `http://192.168.18.225:8000/notifications/mark-as-read`,
        {
          notification_id: notificationId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const userId = user?.user_id;
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      console.log('Marking all notifications as read for user ID:', userId);
      await axios.post(
        `http://192.168.18.225:8000/notifications/mark-all-as-read`,
        {
          user_id: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken, // Include the CSRF token from Laravel
            'X-Requested-With': 'XMLHttpRequest',
          }
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const csrfResponse = await axios.get('http://192.168.18.225:8000/csrf-token');
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      await axios.post(
        `http://192.168.18.225:8000/notifications/remove`
        ,
        {
          notification_id: notificationId,
        },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest', // Laravel often expects this header
            'X-CSRF-TOKEN': csrfToken, // Add CSRF token here
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.notification_id !== notificationId
        )
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark All as Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications to display.</Text>
        </View>
      ) : (
        <ScrollView style={styles.notificationList}>
          {notifications.map((notification) => (
            <View
              key={notification.notification_id}
              style={[
                styles.notificationCard,
                notification.is_read
                  ? styles.readNotification
                  : styles.unreadNotification,
              ]}
            >
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>
                  {notification.notification_type || 'Notification'}
                </Text>
                <Text style={styles.notificationDescription}>
                  {notification.message || 'No details available.'}
                </Text>
              </View>
              <View style={styles.notificationActions}>
                {!notification.is_read && (
                  <TouchableOpacity
                    onPress={() => handleMarkAsRead(notification.notification_id)}
                  >
                    <Text style={styles.markReadText}>Mark as Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteNotification(notification.notification_id)}
                >
                  <FontAwesome name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

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
  container: { flex: 1, backgroundColor: '#121212', marginTop: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  headerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', gap: 15 },
  markAllReadText: { color: '#4caf50', fontSize: 16 },
  clearText: { color: '#00b4d8', fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#aaa', fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#aaa', fontSize: 16 },
  notificationList: { flex: 1, padding: 10 },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  readNotification: { opacity: 0.6 },
  unreadNotification: { opacity: 1 },
  notificationText: { flex: 1, marginRight: 10 },
  notificationTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  notificationDescription: { color: '#aaa', fontSize: 14 },
  notificationActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  markReadText: { color: '#4caf50', fontSize: 14 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
  },
});
