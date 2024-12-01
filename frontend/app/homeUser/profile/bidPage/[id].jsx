import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function BidDetailsPage() {
  const { id } = useLocalSearchParams(); // Extract id from route params
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null); // Holds vehicle details
  const [bids, setBids] = useState([]); // Holds bid details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch vehicle details and bids
  const fetchBids = async () => {
    setLoading(true);
    console.log('Fetching bids for vehicle:', id);
    try {
      const response = await axios.get(`${BASE_URL}/getBids/${id}`);
      const data = response.data;

      if (data.vehicle) {
        setVehicle(data.vehicle);
      }

      if (data.bids && Array.isArray(data.bids)) {
        setBids(data.bids);
      } else {
        Alert.alert('Error', 'No bids found.');
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      Alert.alert('Error', 'Unable to fetch bids. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Approve a bid for the vehicle
  const approveBid = async (bidId) => {
    try {
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
        `${BASE_URL}/approveBid`,
        { bid_id: bidId, id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Bid has been approved.');
        fetchBids(); // Refresh bids after approval
      } else {
        Alert.alert('Error', 'Failed to approve the bid. Please try again.');
      }
    } catch (error) {
      console.error('Error approving bid:', error);
      Alert.alert('Error', 'Unable to approve bid. Please try again.');
    }
  };

  // Close the bidding for the vehicle
  const closeBid = async () => {
    try {
      const csrfResponse = await axios.get(`${BASE_URL}/csrf-token`);
      const csrfToken = csrfResponse.data.csrf_token;

      const response = await axios.post(
       `${BASE_URL}/closeBid`,
        { id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Bidding has been closed.');
        fetchBids(); // Refresh vehicle details after closing the bid
      } else {
        Alert.alert('Error', 'Failed to close the bid. Please try again.');
      }
    } catch (error) {
      console.error('Error closing bid:', error);
      Alert.alert('Error', 'Unable to close bid. Please try again.');
    }
  };

  useEffect(() => {
    fetchBids();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading vehicle and bids...</Text>
      </View>
    );
  }

  const isClosed = vehicle?.availability_status === 'sold'; // Determine if bidding is closed

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Bids</Text>
        {!isClosed && (
          <TouchableOpacity style={styles.closeBidButton} onPress={closeBid}>
            <Text style={styles.closeBidText}>Close Bids</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Vehicle Details */}
      {vehicle && (
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: vehicle.image || 'https://via.placeholder.com/300' }}
              style={styles.vehicleImage}
            />
          </View>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{vehicle.name || 'Unnamed Vehicle'}</Text>
            <Text style={styles.vehicleAvailability}>
              Availability: {vehicle.availability_status || 'N/A'}
            </Text>
            <Text style={styles.vehiclePrice}>Price: {vehicle.price || 'N/A'}</Text>
          </View>
        </View>
      )}

      {/* Bids Section */}
      {!isClosed ? (
        <>
          <View style={styles.bidHeader}>
            <Text style={styles.headerColumn}>Name</Text>
            <Text style={styles.headerColumn}>Bid</Text>
            <Text style={styles.headerColumn}>Action</Text>
          </View>

          {bids.length > 0 ? (
            <FlatList
              data={bids}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.bidRow}>
                  <Text style={styles.rowText}>{item.bidder_name}</Text>
                  <Text style={styles.rowText}>{item.bid_amount}</Text>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => approveBid(item.id)}
                    disabled={item.bid_status === 'won'}
                  >
                    <Text style={styles.approveText}>
                      {item.bid_status === 'won' ? 'Approved' : 'Approve'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noBidsText}>No bids available for this vehicle.</Text>
          )}
        </>
      ) : (
        <Text style={styles.closedText}>This bidding has been closed.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  closeBidButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  closeBidText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  vehicleImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  vehicleDetails: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  vehicleName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  vehicleAvailability: {
    color: '#aaa',
    fontSize: 16,
    marginVertical: 5,
  },
  vehiclePrice: {
    color: '#fff',
    fontSize: 16,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  headerColumn: {
    color: '#00b4d8',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  rowText: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  approveButton: {
    backgroundColor: '#00b4d8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  approveText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noBidsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  closedText: {
    textAlign: 'center',
    color: '#ff4d4d',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
