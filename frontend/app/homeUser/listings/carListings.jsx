import React, { useState, useCallback ,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../../../components/bottomNav'; // Import BottomNav component

export default function ProductListingsPage() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeTab, setActiveTab] = useState('Buy a Vehicle');
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Separate state for input field
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const router = useRouter();

  // Fetch vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      const user_id = user.user_id;
      const response = await fetch(`http://192.168.18.225:8000/vehicles?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
      filterVehicles(data, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, availabilityFilter, vehicleTypeFilter, searchQuery]);


  const fetchUnreadNotifications = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);

      if (user && user.unread_notifications_count !== undefined) {
        setUnreadNotifications(user.unread_notifications_count);
      } else {
        console.error('Unread notifications count not found in user object.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  // Filter vehicles based on various criteria
  const filterVehicles = useCallback(
    (vehicles, tab, availability, type, query) => {
      let filtered = vehicles;

      // Filter by listing type
      if (tab === 'Buy a Vehicle') {
        filtered = filtered.filter((vehicle) => vehicle.listing_type === 'sale');
      } else if (tab === 'Rent a Vehicle') {
        filtered = filtered.filter((vehicle) => vehicle.listing_type === 'rent');
      }

      // Filter by availability
      if (availability !== 'all') {
        filtered = filtered.filter((vehicle) => vehicle.availability_status === availability);
      }

      // Filter by vehicle type
      if (type !== 'all') {
        filtered = filtered.filter((vehicle) => vehicle.vehicle_type === type);
      }

      // Search by type and model
      if (query.trim() !== '') {
        filtered = filtered.filter(
          (vehicle) =>
            vehicle.vehicle_type.toLowerCase().includes(query.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredVehicles(filtered);
    },
    []
  );

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      filterVehicles(vehicles, tab, availabilityFilter, vehicleTypeFilter, searchQuery);
    },
    [vehicles, availabilityFilter, vehicleTypeFilter, searchQuery, filterVehicles]
  );

  const handleApplyFilters = useCallback(() => {
    filterVehicles(vehicles, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery);
    setModalVisible(false); // Close the modal after applying filters
  }, [vehicles, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery, filterVehicles]);

  // Handle Search Button Press
  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput); // Update the searchQuery state
    filterVehicles(vehicles, activeTab, availabilityFilter, vehicleTypeFilter, searchInput); // Apply filters
  }, [searchInput, vehicles, activeTab, availabilityFilter, vehicleTypeFilter, filterVehicles]);

  // Fetch vehicles when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, [fetchVehicles])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Buy a Vehicle' && styles.activeTab]}
          onPress={() => handleTabChange('Buy a Vehicle')}
        >
          <Text style={[styles.tabText, activeTab === 'Buy a Vehicle' && styles.activeTabText]}>Buy a Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Rent a Vehicle' && styles.activeTab]}
          onPress={() => handleTabChange('Rent a Vehicle')}
        >
          <Text style={[styles.tabText, activeTab === 'Rent a Vehicle' && styles.activeTabText]}>Rent a Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
      <TextInput
          style={styles.searchInput}
          placeholder="Search for a vehicle..."
          placeholderTextColor="#888"
          value={searchInput} // Bind input state
          onChangeText={(text) => setSearchInput(text)} // Update input state
        />
        <TouchableOpacity onPress={handleSearch}> 
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {/* Open Filter Modal */}
          <FontAwesome name="filter" size={20} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {filteredVehicles.length === 0 ? (
        <View style={styles.noVehiclesContainer}>
          <Text style={styles.noVehiclesText}>No vehicles found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.vehicle_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push(`/homeUser/listings/carDetails/${item.vehicle_id}`)}
            >
              <Image source={{ uri: item.images?.[0]?.image_url || 'https://via.placeholder.com/150' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name || 'Unnamed Vehicle'}</Text>
                <View style={styles.rating}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={16} // Slightly larger for better visibility
                      color={i < item.condition ? '#FFD700' : '#555'} // Gold for active stars, grey for inactive
                      style={styles.star}
                    />
                  ))}
                </View>
                <Text style={styles.productPrice}>Price: {item.price || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.productList}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNav unreadNotifications={unreadNotifications} />

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
  noVehiclesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVehiclesText: {
    color: '#fff',
    fontSize: 18,
  },
});
