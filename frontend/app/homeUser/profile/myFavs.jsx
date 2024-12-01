import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils/config'; // Import the base URL
export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState('For Buy');
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const router = useRouter();

  // Fetch the user's favorites when the component is mounted
  const fetchFavorites = async () => {
    try {
      const userString = await AsyncStorage.getItem('user'); // Get the logged-in user's ID
      const user = JSON.parse(userString);
      const userId = user?.user_id;
      if (userId) {
        const response = await fetch(`${BASE_URL}/getFavourites?user_id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favourites);
          filterFavorites(data.favourites, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery);
        } else {
          console.error('Failed to fetch favorites');
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Function to handle removing a product
  const handleRemove = async (id) => {
    setFavorites(favorites.filter((product) => product.id !== id));
    setFilteredFavorites(filteredFavorites.filter((product) => product.id !== id));
    // Add API call for removing the product here if required
  };

  // Filter favorites based on criteria
  const filterFavorites = useCallback(
    (favorites, tab, availability, type, query) => {
      let filtered = favorites;

      // Filter by listing type
      if (tab === 'For Buy') {
        filtered = filtered.filter((favorite) => favorite.vehicle.listing_type === 'sale');
      } else if (tab === 'For Rent') {
        filtered = filtered.filter((favorite) => favorite.vehicle.listing_type === 'rent');
      }

      // Filter by availability
      if (availability !== 'all') {
        filtered = filtered.filter((favorite) => favorite.vehicle.availability_status === availability);
      }

      // Filter by vehicle type
      if (type !== 'all') {
        filtered = filtered.filter((favorite) => favorite.vehicle.vehicle_type === type);
      }

      // Search by type and model
      if (query.trim() !== '') {
        filtered = filtered.filter(
          (favorite) =>
            favorite.vehicle.vehicle_type.toLowerCase().includes(query.toLowerCase()) ||
            favorite.vehicle.model.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredFavorites(filtered);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      filterFavorites(favorites, tab, availabilityFilter, vehicleTypeFilter, searchQuery);
    },
    [favorites, availabilityFilter, vehicleTypeFilter, searchQuery, filterFavorites]
  );

  const handleApplyFilters = useCallback(() => {
    filterFavorites(favorites, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery);
    setModalVisible(false); // Close the modal after applying filters
  }, [favorites, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery, filterFavorites]);

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput); // Update the searchQuery state
    filterFavorites(favorites, activeTab, availabilityFilter, vehicleTypeFilter, searchInput);
  }, [searchInput, favorites, activeTab, availabilityFilter, vehicleTypeFilter, filterFavorites]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'For Buy' && styles.activeTab]}
          onPress={() => handleTabChange('For Buy')}
        >
          <Text style={[styles.tabText, activeTab === 'For Buy' && styles.activeTabText]}>For Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'For Rent' && styles.activeTab]}
          onPress={() => handleTabChange('For Rent')}
        >
          <Text style={[styles.tabText, activeTab === 'For Rent' && styles.activeTabText]}>For Rent</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your favorites..."
          placeholderTextColor="#888"
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome name="filter" size={20} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Product List (Favorites) */}
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={styles.productCard}
          onPress={() => router.push(`/homeUser/listings/carDetails/${item.vehicle_id}`)}
        >
          <Image source={{ uri: item.vehicle_image_url  || 'https://via.placeholder.com/150' }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.vehicle.name || 'Unnamed Vehicle'}</Text>
            <View style={styles.rating}>
              {Array.from({ length: 5 }, (_, i) => (
                <FontAwesome
                  key={i}
                  name="star"
                  size={16} // Slightly larger for better visibility
                  color={i < item.vehicle.condition ? '#FFD700' : '#555'} // Gold for active stars, grey for inactive
                  style={styles.star}
                />
              ))}
            </View>
       
            <Text style={styles.productPrice}>Price: {item.vehicle.price || 'N/A'}</Text>
          </View>
        </TouchableOpacity>
        )}
        style={styles.productList}
      />

      {/* Filter Modal */}
   {/* Filter Modal */}
   <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Filters</Text>

            {/* Availability Filter */}
            <Text style={styles.filterLabel}>Availability</Text>
            <TouchableOpacity onPress={() => setAvailabilityFilter('available')} style={styles.filterOption}>
              <Text style={availabilityFilter === 'available' ? styles.selectedOption : styles.optionText}>
                Available
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAvailabilityFilter('sold')} style={styles.filterOption}>
              <Text style={availabilityFilter === 'sold' ? styles.selectedOption : styles.optionText}>
                Sold
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAvailabilityFilter('rented')} style={styles.filterOption}>
              <Text style={availabilityFilter === 'rented' ? styles.selectedOption : styles.optionText}>
                Rented
              </Text>
            </TouchableOpacity>

            {/* Vehicle Type Filter */}
               {/* Vehicle Type Filter */}
               <Text style={styles.filterLabel}>Vehicle Type</Text>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('sedans')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'sedans' ? styles.selectedOption : styles.optionText}>sedans</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('suvs')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'suvs' ? styles.selectedOption : styles.optionText}>SUVS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('trucks')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'trucks' ? styles.selectedOption : styles.optionText}>Truck</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('bikes')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'bikes' ? styles.selectedOption : styles.optionText}>Bikes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('e-cars')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'e-cars' ? styles.selectedOption : styles.optionText}>E-Cars</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('sports')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'sports' ? styles.selectedOption : styles.optionText}>Sports</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('new')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'new' ? styles.selectedOption : styles.optionText}>New</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVehicleTypeFilter('used')} style={styles.filterOption}>
              <Text style={vehicleTypeFilter === 'used' ? styles.selectedOption : styles.optionText}>Used</Text>
            </TouchableOpacity>



            {/* Apply Filters Button */}
            <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { color: '#fff', marginTop: 10 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1E1E1E', paddingVertical: 10 },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00b4d8' },
  tabText: { color: '#888', fontSize: 16 },
  activeTabText: { color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 10, margin: 10, paddingHorizontal: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  filterIcon: { marginLeft: 10 },
  productList: { flex: 1, paddingHorizontal: 10 },
  productCard: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 10, marginVertical: 5, padding: 10 },
  productImage: { width: 100, height: 70, borderRadius: 10 },
  productInfo: { flex: 1, marginLeft: 10 },
  productName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  productPrice: { color: '#aaa', fontSize: 14 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#121212', paddingVertical: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  filterLabel: { color: '#aaa', fontSize: 14, marginTop: 10 },
  filterOption: { marginVertical: 5, padding: 10, borderRadius: 5, backgroundColor: '#333' },
  optionText: { color: '#aaa', fontSize: 14 },
  selectedOption: { color: '#00b4d8', fontSize: 14 },
  applyButton: { backgroundColor: '#00b4d8', padding: 10, borderRadius: 5, marginTop: 20 },
  applyButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  rating: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    padding: 5,
  },
});
