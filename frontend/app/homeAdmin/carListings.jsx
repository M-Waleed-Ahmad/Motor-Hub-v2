import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter to navigate

export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState('Buy a Vehicle');
  const router = useRouter(); // Initialize the router

  const products = [
    { id: 1, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
  ];

  const navigateToDetails = (carId) => {
    router.push(`/homeUser/listings/carDetails?id=${carId}`); // Navigate to car details page
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Content Management</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Buy a Vehicle' && styles.activeTab]}
          onPress={() => setActiveTab('Buy a Vehicle')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Buy a Vehicle' && styles.activeTabText,
            ]}
          >
            Buy a Vehicle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Rent a Vehicle' && styles.activeTab]}
          onPress={() => setActiveTab('Rent a Vehicle')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Rent a Vehicle' && styles.activeTabText,
            ]}
          >
            Rent a Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hinted search text"
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="filter" size={20} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard} >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome key={i} name="star" size={14} color="#00b4d8" />
                ))}
              </View>
              <Text style={styles.productPrice}>Price: {item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToDetails(item.id)}
            >
              <FontAwesome name="edit" size={20} color="#00b4d8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <FontAwesome name="times" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
        style={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00b4d8',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  filterIcon: {
    marginLeft: 10,
  },
  productList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  productPrice: {
    color: '#aaa',
    fontSize: 14,
  },
  editButton: {
    marginHorizontal: 5,
  },
  deleteButton: {
    marginHorizontal: 5,
  },
});
