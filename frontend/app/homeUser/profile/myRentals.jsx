import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState('Rentals Owned');
  const [products, setProducts] = useState([
    { id: 1, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Car Name Unknown', price: 'Free', image: 'https://via.placeholder.com/150' },
  ]);
  const router = useRouter();

  // Function to handle removing a product
  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
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
          style={[styles.tab, activeTab === 'Rentals Owned' && styles.activeTab]}
          onPress={() => setActiveTab('Rentals Owned')}
        >
          <Text style={[styles.tabText, activeTab === 'Rentals Owned' && styles.activeTabText]}>Rentals Owned</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Rentals Taken' && styles.activeTab]}
          onPress={() => setActiveTab('Rentals Taken')}
        >
          <Text style={[styles.tabText, activeTab === 'Rentals Taken' && styles.activeTabText]}>Rentals Taken</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Hinted search text" placeholderTextColor="#888" />
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
          <View style={styles.productCard}>
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
            {/* Remove Button */}
            <TouchableOpacity onPress={() => removeProduct(item.id)} style={styles.removeButton}>
              <FontAwesome name="close" size={20} color="#fff" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
    width: 100,
    height: 70,
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
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    padding: 5,
  },
});
