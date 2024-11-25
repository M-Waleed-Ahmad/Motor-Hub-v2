import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BidDetailsPage() {
  const router = useRouter();

  const bids = [
    { id: '1', name: 'Test Name 1', bid: 10000 },
    { id: '2', name: 'Test Name 2', bid: 10000 },
    { id: '3', name: 'Test Name 3', bid: 10000 },
    { id: '4', name: 'Test Name 4', bid: 10000 },
    { id: '5', name: 'Test Name 5', bid: 10000 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle's Details</Text>
        <TouchableOpacity style={styles.closeBidButton}>
          <Text style={styles.closeBidText}>Close Bid</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/150', // Replace with the actual image URL
          }}
          style={styles.vehicleImage}
        />
      </View>

      {/* Vehicle Name */}
      <View style={styles.vehicleNameContainer}>
        <Text style={styles.vehicleName}>Ferrari</Text>
      </View>

      {/* Bid List Header */}
      <View style={styles.bidHeader}>
        <Text style={styles.headerColumn}>Name</Text>
        <Text style={styles.headerColumn}>Bid</Text>
        <Text style={styles.headerColumn}>Action</Text>
      </View>

      {/* Bid List */}
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bidRow}>
            <Text style={styles.rowText}>{item.name}</Text>
            <Text style={styles.rowText}>{item.bid}</Text>
            <TouchableOpacity style={styles.approveButton}>
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    marginTop: 30, // Add margin at the top
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
  vehicleNameContainer: {
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
});
