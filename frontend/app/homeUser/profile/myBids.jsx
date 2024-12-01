import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils/config';
export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState('My Listings');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch data based on the active tab
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem('user'); // Get logged-in user details
      if (!userString) {
        Alert.alert('Error', 'User not logged in');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userString);
      const endpoint =
        activeTab === 'My Listings'
          ? `${BASE_URL}/myListings?user_id=${user.user_id}`
          : `${BASE_URL}/bidsMade?user_id=${user.user_id}`;

      const response = await axios.get(endpoint);

      // Validate response before setting the state
      if (Array.isArray(response.data)) {
        setProducts(response.data); // Update products state with fetched data
      } else {
        Alert.alert('Error', 'Invalid response from the server.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Unable to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the active tab changes
  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  // Handle navigation to the appropriate page based on the tab
  const handlePressProduct = (item) => {
    if (activeTab === 'My Listings') {
      // Go to Bid Approval page
      console.log(item.vehicle_id);
      router.push(`/homeUser/profile/bidPage/${item.vehicle_id}`);
    } else if (activeTab === 'Bids Made') {
      // Go to Bid Making page
      router.push(`/homeUser/listings/carBid/`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Listings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'My Listings' && styles.activeTab]}
          onPress={() => setActiveTab('My Listings')}
        >
          <Text style={[styles.tabText, activeTab === 'My Listings' && styles.activeTabText]}>My Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Bids Made' && styles.activeTab]}
          onPress={() => setActiveTab('Bids Made')}
        >
          <Text style={[styles.tabText, activeTab === 'Bids Made' && styles.activeTabText]}>Bids Made</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.vehicle_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePressProduct(item)} // Navigate based on active tab
              style={styles.productCard}
            >
              <Image
                source={{ uri: item.images[0]?.image_url || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.model}</Text>
                <Text style={styles.productPrice}>Price: {item.price}</Text>
                {activeTab === 'My Listings' && (
                  <Text style={styles.bidsCount}>Bids: {item.bids_count}</Text>
                )}
                {activeTab === 'Bids Made' && (
                  <Text style={styles.bidAmount}>
                    Your Bid: {item.bids?.[0]?.bid_amount || 'N/A'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          style={styles.productList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 10 },
  backButton: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1E1E1E', paddingVertical: 10 },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00b4d8' },
  tabText: { color: '#888', fontSize: 16 },
  activeTabText: { color: '#fff' },
  productList: { flex: 1, paddingHorizontal: 10 },
  productCard: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 10, marginVertical: 5, padding: 10 },
  productImage: { width: 100, height: 70, borderRadius: 10 },
  productInfo: { flex: 1, marginLeft: 10 },
  productName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  productPrice: { color: '#aaa', fontSize: 14 },
  bidsCount: { color: '#aaa', fontSize: 14 },
  bidAmount: { color: '#aaa', fontSize: 14 },
  loadingText: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
});
