import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const BottomNav = ({ unreadNotifications }) => {
  const pathname = usePathname(); // Get the current route

  // Function to determine if a tab is active
  const isActive = (route) => pathname === route;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity>
        <Link href="/homeUser/profile">
          <FontAwesome
            name="user"
            size={30}
            color={isActive('/homeUser/profile') ? '#00b4d8' : 'white'}
          />
        </Link>
      </TouchableOpacity>
      <TouchableOpacity>
        <Link href="/homeUser/listings/carListings">
          <FontAwesome
            name="car"
            size={30}
            color={isActive('/homeUser/listings/carListings') ? '#00b4d8' : 'white'}
          />
        </Link>
      </TouchableOpacity>
      <TouchableOpacity>
        <Link href="/homeUser/home">
          <FontAwesome
            name="home"
            size={30}
            color={isActive('/homeUser/home') ? '#00b4d8' : 'white'}
          />
        </Link>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bellContainer}>
        <Link href="/homeUser/notifications">
          <FontAwesome
            name="bell"
            size={30}
            color={isActive('/homeUser/notifications') ? '#00b4d8' : 'white'}
          />
        </Link>
        {unreadNotifications > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
              {unreadNotifications}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity>
        <Link href="/homeUser/settings">
          <FontAwesome
            name="cog"
            size={30}
            color={isActive('/homeUser/settings') ? '#00b4d8' : 'white'}
          />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 1,
  },
  bellContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#FF3D00',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BottomNav;
