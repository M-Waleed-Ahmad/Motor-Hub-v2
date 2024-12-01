import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomNav from '../../components/bottomNav'; // Import BottomNav component
import { BASE_URL } from '../../utils/config'; // Import the base URL
import MapView, { Marker } from 'react-native-maps'; // Import MapView

const SettingsScreen = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [openSections, setOpenSections] = useState({}); // Tracks which sections are open
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const router = useRouter();

  const settingsOptions = [
    {
      label: 'Location',
      icon: 'map-marker',
      content: (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.78825, // Default latitude
              longitude: -122.4324, // Default longitude
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Add a marker */}
            <Marker
              coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
              title="Default Location"
              description="This is a sample marker."
            />
          </MapView>
        </View>
      ),
    },
    {
      label: 'Payment Method',
      icon: 'credit-card',
      content: (
        <View style={styles.paymentMethodForm}>
          <Text style={styles.paymentMethodTitle}>Add Payment Method</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Card Number"
            value={paymentMethod.cardNumber}
            onChangeText={(text) => setPaymentMethod({ ...paymentMethod, cardNumber: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Expiry Date (MM/YY)"
            value={paymentMethod.expiryDate}
            onChangeText={(text) => setPaymentMethod({ ...paymentMethod, expiryDate: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="CVV"
            value={paymentMethod.cvv}
            onChangeText={(text) => setPaymentMethod({ ...paymentMethod, cvv: text })}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handlePaymentSubmit}>
            <Text style={styles.submitButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      label: 'Passwords',
      icon: 'eye',
      content: (
        <View style={styles.passwordForm}>
          <Text style={styles.passwordTitle}>Change Password</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Old Password"
            secureTextEntry
            value={passwords.oldPassword}
            onChangeText={(text) => setPasswords({ ...passwords, oldPassword: text })}
          />
          <TextInput
            style={styles.inputField}
            placeholder="New Password"
            secureTextEntry
            value={passwords.newPassword}
            onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Confirm New Password"
            secureTextEntry
            value={passwords.confirmNewPassword}
            onChangeText={(text) => setPasswords({ ...passwords, confirmNewPassword: text })}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handlePasswordChange}>
            <Text style={styles.submitButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    { label: 'Security', 
      icon: 'lock',
      content: (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            END TO END ENCRYPTED
          </Text>
        </View>
      )
    },
    {
      label: 'About',
      icon: 'info-circle',
      content: (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            MOTORHUB is your trusted online platform for buying and selling cars, offering a seamless
            experience with a wide selection of vehicles to choose from. Whether you're looking to buy
            your dream car or sell your current one, MOTORHUB makes the process fast, secure, and
            hassle-free.
          </Text>
        </View>
      ),
    },
    {
      label: 'Help and Support',
      icon: 'headphones',
      content: (
        <View style={styles.helpSupportContainer}>
          <Text style={styles.helpSupportText}>Contact Us: 042-XXX-XXXXX</Text>
        </View>
      ),
    },
    { label: 'Rules of Service',
       icon: 'book',
       content: (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>
            Eligibility: Users must be at least 18 years old and legally able to enter agreements.

            Account Responsibility: Users are responsible for the confidentiality and activity under their account.

            Payment Policy: Payments must be made through approved methods, and MotorHub may cancel transactions in case of issues.

            Prohibited Conduct: Fraud, spamming, and malicious activity are prohibited.

            User Data: Personal data is collected and processed according to the privacy policy.

            Product Listings: Sellers must provide accurate vehicle information; MotorHub does not verify listings.

            Transaction Disputes: MotorHub attempts to mediate, but is not responsible for resolving disputes.

            Returns and Refunds: Refunds are processed according to specific seller return policies.

            Modification of Service: MotorHub can change, suspend, or terminate services without notice.

            Indemnity: Users agree to hold MotorHub harmless from any claims or damages from their use of the platform.
            
            Termination of Service: Accounts may be suspended or terminated for policy violations or inactivity.
          </Text>
        </View>
      ),
      },
  ];

  const handleToggleSection = (index) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the visibility of the section
    }));
    console.log(`Toggling section ${index}, open: ${!openSections[index]}`); // Debugging log
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      const response = await axios.post(`${BASE_URL}/logout`);

      console.log('Logout Response:', response.data);

      // Clear user token from AsyncStorage
      await AsyncStorage.removeItem('userToken');

      // Navigate to login page
      router.replace('/login');
      Alert.alert('Logout Successful', 'You have been logged out.');
    } catch (error) {
      console.error('Logout Error:', error.response?.data || error);
      Alert.alert(
        'Logout Failed',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

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

  const handlePaymentSubmit = () => {
    if (!paymentMethod.cardNumber || !paymentMethod.expiryDate || !paymentMethod.cvv) {
      Alert.alert('Incomplete Information', 'Please fill in all fields.');
      return;
    }

    // Here you would typically send the payment information to your server
    console.log('Submitting payment method:', paymentMethod);
    Alert.alert('Payment Method Added', 'Your payment method has been added successfully.');
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Password Mismatch', 'The new password and confirmation do not match.');
      return;
    }

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BASE_URL}/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log('Password Change Response:', response.data);
      Alert.alert('Password Changed', 'Your password has been updated successfully.');
    } catch (error) {
      console.error('Password Change Error:', error.response?.data || error);
      Alert.alert('Password Change Failed', 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Settings List */}
      <ScrollView contentContainerStyle={styles.settingsList}>
        {settingsOptions.map((option, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => handleToggleSection(index)}
            >
              <FontAwesome
                name={option.icon}
                size={20}
                color="#aaa"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsLabel}>{option.label}</Text>
              <FontAwesome
                name={openSections[index] ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#aaa"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {openSections[index] && <View style={styles.dropdownContent}>{option.content}</View>}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav unreadNotifications={unreadNotifications} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    marginTop: 6,
    backgroundColor: '#121212',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 16,
  },
  logoutText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsList: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  settingsIcon: {
    marginRight: 15,
  },
  settingsLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  dropdownContent: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    marginTop: -8,
    marginBottom: 8,
    borderRadius: 8,
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  paymentMethodForm: {
    padding: 15,
  },
  paymentMethodTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputField: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  passwordForm: {
    padding: 15,
  },
  passwordTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  helpSupportContainer: {
    padding: 15,
  },
  helpSupportText: {
    color: '#fff',
    fontSize: 16,
  },
  aboutContainer: {
    padding: 15,
  },
  aboutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;
