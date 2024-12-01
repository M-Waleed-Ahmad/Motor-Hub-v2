import React, { useState, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../../utils/config';
export default function ProductListingsPage() {
  const [activeTab, setActiveTab] = useState('Buy a Vehicle');
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  // Fetch vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);

      const userString = await AsyncStorage.getItem('user');
      if (!userString) {
        console.error('No user found in AsyncStorage.');
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const user = JSON.parse(userString);
      const user_id = user.user_id;

      const response = await fetch(`${BASE_URL}/vehicles?user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      console.log('Vehicles:', data);
      setVehicles(data);
      filterVehicles(data, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, availabilityFilter, vehicleTypeFilter, searchQuery]);

  // Filter vehicles
  const filterVehicles = useCallback(
    (vehicles, tab, availability, type, query) => {
      let filtered = vehicles;

      if (tab === 'Buy a Vehicle') {
        filtered = filtered.filter((vehicle) => vehicle.listing_type === 'sale');
      } else if (tab === 'Rent a Vehicle') {
        filtered = filtered.filter((vehicle) => vehicle.listing_type === 'rent');
      }

      if (availability !== 'all') {
        filtered = filtered.filter((vehicle) => vehicle.availability_status === availability);
      }

      if (type !== 'all') {
        filtered = filtered.filter((vehicle) => vehicle.vehicle_type === type);
      }

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
    setModalVisible(false);
  }, [vehicles, activeTab, availabilityFilter, vehicleTypeFilter, searchQuery, filterVehicles]);

  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    filterVehicles(vehicles, activeTab, availabilityFilter, vehicleTypeFilter, searchInput);
  }, [searchInput, vehicles, activeTab, availabilityFilter, vehicleTypeFilter, filterVehicles]);

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
          <Text style={[styles.tabText, activeTab === 'Buy a Vehicle' && styles.activeTabText]}>
            Buy a Vehicle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Rent a Vehicle' && styles.activeTab]}
          onPress={() => handleTabChange('Rent a Vehicle')}
        >
          <Text style={[styles.tabText, activeTab === 'Rent a Vehicle' && styles.activeTabText]}>
            Rent a Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a vehicle..."
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

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <View style={styles.noVehiclesContainer}>
          <Text style={styles.noVehiclesText}>No vehicles found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.vehicle_id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: item.images?.[0]?.image_url || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.images?.[0]?.image_url || 'Unnamed Vehicle'}</Text>
                <View style={styles.rating}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <FontAwesome
                      key={i}
                      name="star"
                      size={16}
                      color={i < item.condition ? '#FFD700' : '#555'}
                    />
                  ))}
                </View>
                <Text style={styles.productPrice}>Price: {item.price || 'N/A'}</Text>
              </View>
            </View>
          )}
          style={styles.productList}
        />
      )}

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

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Filters</Text>
            <View style={styles.filterOption}>
              <Text style={styles.filterLabel}>Availability</Text>
              <Picker
                selectedValue={availabilityFilter}
                style={styles.picker}
                onValueChange={(value) => setAvailabilityFilter(value)}
              >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Available" value="available" />
                <Picker.Item label="Not Available" value="not_available" />
              </Picker>
            </View>
            <View style={styles.filterOption}>
              <Text style={styles.filterLabel}>Vehicle Type</Text>
              <Picker
                selectedValue={vehicleTypeFilter}
                style={styles.picker}
                onValueChange={(value) => setVehicleTypeFilter(value)}
              >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Car" value="car" />
                <Picker.Item label="Truck" value="truck" />
                <Picker.Item label="Motorcycle" value="motorcycle" />
              </Picker>
            </View>
            <TouchableOpacity onPress={handleApplyFilters} style={styles.applyFiltersButton}>
              <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', marginTop: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { color: '#fff', marginTop: 10 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#00b4d8' },
  tabText: { color: '#888', fontSize: 16 },
  activeTabText: { color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 10, margin: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  filterIcon: { marginLeft: 10 },
  productList: { flex: 1 },
  productCard: { flexDirection: 'row', margin: 10 },
  productImage: { width: 100, height: 70, borderRadius: 10 },
  productInfo: { marginLeft: 10 },
  productName: { color: '#fff', fontSize: 16 },
  rating: { flexDirection: 'row', marginVertical: 5 },
  productPrice: { color: '#aaa', fontSize: 14 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10 },
  modalTitle: { color: '#fff', fontSize: 18 },
  filterLabel: { color: '#aaa', fontSize: 14 },
  filterOption: { marginVertical: 5 },
  picker: { color: '#fff' },
  applyFiltersButton: { backgroundColor: '#00b4d8', borderRadius: 5 },
  applyFiltersButtonText: { textAlign: 'center', color: '#fff', padding: 10 },
  closeModalButton: { marginTop: 10 },
  closeModalButtonText: { textAlign: 'center', color: '#aaa' },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
  },
});

