import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const PaymentConfirmationScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Confirmation</Text>
      </View>

      {/* Confirmation Content */}
      <View style={styles.content}>
        <FontAwesome name="thumbs-up" size={80} color="#fff" />
        <Text style={styles.successText}>Deal was Successful</Text>
        <View style={styles.starsContainer}>
          <FontAwesome name="star" size={20} color="#FFD700" />
          <FontAwesome name="star" size={20} color="#FFD700" />
          <FontAwesome name="star" size={20} color="#FFD700" />
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: You will be soon notified of the confirmation of the deal.
          </Text>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <FontAwesome name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="car" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="plus-circle" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="cog" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  noteContainer: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
  },
  noteText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 10,
  },
});

export default PaymentConfirmationScreen;
