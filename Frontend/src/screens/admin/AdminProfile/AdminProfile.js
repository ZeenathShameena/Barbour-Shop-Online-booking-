import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch
} from 'react-native';
import { useAuth } from './../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AdminProfileStyles';
import { useTheme } from './../../../context/ThemeContext'; // Import theme context

const CustomerProfile = () => {
  const { logout, token } = useAuth();
  
  const { currentTheme, toggleTheme } = useTheme(); // Use theme context
  const navigation = useNavigation();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Update modal states
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Preference states
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Themed styles
  const themedStyles = {
    container: [
      styles.container, 
      { backgroundColor: currentTheme.backgroundColor }
    ],
    profileContainer: [
      styles.profileContainer, 
      { 
        backgroundColor: currentTheme.cardColor,
        shadowColor: currentTheme.shadowColor 
      }
    ],
    title: [
      styles.title, 
      { color: currentTheme.textColor }
    ],
    sectionContainer: [
      styles.sectionContainer, 
      { backgroundColor: currentTheme.inputBackground }
    ],
    sectionTitle: [
      styles.sectionTitle, 
      { 
        color: currentTheme.textColor,
        borderBottomColor: currentTheme.borderColor 
      }
    ],
    infoRow: [
      styles.infoRow, 
      { 
        backgroundColor: currentTheme.inputBackground,
        borderColor: currentTheme.borderColor 
      }
    ],
    infoText: [
      styles.infoText, 
      { color: currentTheme.textColor }
    ],
    modalContainer: [
      styles.modalContainer,
      { backgroundColor: 'rgba(0,0,0,0.5)' }
    ],
    modalContent: [
      styles.modalContent,
      { 
        backgroundColor: currentTheme.cardColor,
        borderColor: currentTheme.borderColor 
      }
    ],
    modalTitle: [
      styles.modalTitle,
      { color: currentTheme.textColor }
    ],
    inputContainer: [
      styles.inputContainer,
      { 
        backgroundColor: currentTheme.inputBackground,
        borderColor: currentTheme.borderColor 
      }
    ],
    input: [
      styles.input,
      { 
        color: currentTheme.inputTextColor,
        backgroundColor: currentTheme.inputBackground,
        borderColor: currentTheme.borderColor 
      }
    ],
    logoutButton: [
      styles.logoutButton,
      { 
        backgroundColor: currentTheme.buttonColor,
        shadowColor: currentTheme.buttonColor 
      }
    ],
    logoutText: [
      styles.logoutText, 
      { color: currentTheme.textColor }
    ],
    updateButton: [
      styles.updateButton,
      { 
        backgroundColor: currentTheme.buttonColor 
      }
    ],
    cancelButtonText: [
      styles.cancelButtonText,
      { color: currentTheme.linkColor }
    ]
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('https://gents-camp.onrender.com/api/admin/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Parsed user data:', data);
      
      if (response.ok) {
        // The user data is directly in the response object, not in a 'user' property
        setUserData(data);
        // Use mobile instead of phone based on your response
        setMobile(data.mobile || '');
        setAddress(data.address || '');
        
       
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Unable to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };
  // Call the function when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Load preferences
  useEffect(() => {
  const loadPreferences = async () => {
    try {
      const notificationsPref = await AsyncStorage.getItem('pushNotifications');
      
      // Get theme object from storage
      const themeSettings = await AsyncStorage.getItem('theme');
      const parsedTheme = themeSettings ? JSON.parse(themeSettings) : { isDarkMode: false };

      setPushNotifications(notificationsPref === 'true');
      setDarkMode(parsedTheme.isDarkMode);
    } catch (error) {
      console.error('Error loading preferences', error);
    }
  };

  loadPreferences();
}, []);

// Alternative approach - Save preferences
useEffect(() => {
  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('pushNotifications', pushNotifications.toString());
      
      // Save theme as an object
      const themeSettings = JSON.stringify({ isDarkMode: darkMode });
      await AsyncStorage.setItem('theme', themeSettings);

      // Update theme based on dark mode toggle
      if (darkMode) {
        toggleTheme('Dark');
      } else {
        toggleTheme('Light');
      }
    } catch (error) {
      console.error('Error saving preferences', error);
    }
  };

  savePreferences();
}, [pushNotifications, darkMode]);

  // Initial data fetch
  useEffect(() => {
    fetchUserData();
  }, []);

  // Validate mobile number
  const validateMobile = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    // Validation checks
    if (!mobile.trim()) {
      Alert.alert('Validation Error', 'Mobile number is required');
      return;
    }

    if (!validateMobile(mobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return;
    }

    setUpdateLoading(true);

    try {
      const response = await fetch('https://gents-camp.onrender.com/api/admin/update-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile,
          address
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user data
        setUserData(prevData => ({
          ...prevData,
          mobile,
          address
        }));

        // Close modal and show success
        setUpdateModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        // Error handling
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      Alert.alert('Error', 'Unable to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle logout confirmation
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            navigation.navigate('Login');
          }
        }
      ],
      { cancelable: true }
    );
  };

  // Render update profile modal
  const renderUpdateModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isUpdateModalVisible}
      onRequestClose={() => setUpdateModalVisible(false)}
    >
      <KeyboardAvoidingView 
        style={themedStyles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={themedStyles.modalContent}>
          <Text style={themedStyles.modalTitle}>Update Profile</Text>
          
          {/* Mobile Number Input */}
          <View style={themedStyles.inputContainer}>
            <Ionicons 
              name="call" 
              size={20} 
              color={currentTheme.accentColor} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={themedStyles.input}
              placeholder="Mobile Number"
              placeholderTextColor={currentTheme.placeholderColor}
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              maxLength={10}
            />
          </View>

          {/* Address Input */}
          <View style={themedStyles.inputContainer}>
            <Ionicons 
              name="location" 
              size={20} 
              color={currentTheme.accentColor} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[themedStyles.input, styles.multilineInput]}
              placeholder="Full Address"
              placeholderTextColor={currentTheme.placeholderColor}
              multiline={true}
              numberOfLines={4}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={themedStyles.updateButton} 
            onPress={handleUpdateProfile}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons 
                  name="save" 
                  size={20} 
                  color={currentTheme.textColor} 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.buttonText}>Update Profile</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setUpdateModalVisible(false)}
          >
            <Text style={themedStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <ScrollView 
      style={themedStyles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Update Profile Modal */}
      {renderUpdateModal()}

      {loading ? (
        <ActivityIndicator 
          size="large" 
          color={currentTheme.accentColor} 
          style={styles.loader} 
        />
      ) : userData ? (
        <View style={themedStyles.profileContainer}>
          <View style={styles.headerContainer}>
            <Text style={themedStyles.title}>My Profile</Text>
            <TouchableOpacity 
              onPress={() => setUpdateModalVisible(true)} 
              style={styles.editButton}
            >
              <Ionicons 
                name="pencil" 
                size={24} 
                color={currentTheme.accentColor} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <Image 
              source={
                userData.profileImage 
                  ? { uri: userData.profileImage } 
                  : require('./../../../assets/images/default-avatar.png')
              } 
              style={styles.profileImage}
            />
          </View>

          {/* Personal Information Section */}
          <View style={themedStyles.sectionContainer}>
            <Text style={themedStyles.sectionTitle}>Personal Information</Text>
            <View style={themedStyles.infoRow}>
              <Ionicons 
                name="person" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>{userData.name}</Text>
            </View>
            <View style={themedStyles.infoRow}>
              <Ionicons 
                name="mail" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>{userData.email}</Text>
            </View>
            {userData.mobile && (
              <View style={themedStyles.infoRow}>
                <Ionicons 
                  name="call" 
                  size={20} 
                  color={currentTheme.accentColor} 
                />
                <Text style={themedStyles.infoText}>{userData.mobile}</Text>
              </View>
            )}
            {userData.address && (
              <View style={themedStyles.infoRow}>
                <Ionicons 
                  name="location" 
                  size={20} 
                  color={currentTheme.accentColor} 
                />
                <Text style={themedStyles.infoText}>{userData.address}</Text>
              </View>
            )}
          </View>

          {/* Preferences Section */}
          <View style={themedStyles.sectionContainer}>
            <Text style={themedStyles.sectionTitle}>Preferences</Text>
            <View style={styles.preferenceRow}>
              <Ionicons 
                name="notifications" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>Push Notifications</Text>
              <Switch
                value={pushNotifications}
               
               
                thumbColor={currentTheme.backgroundColor}
              />
            </View>
            <View style={styles.preferenceRow}>
              <Ionicons 
                name="moon" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ 
                  false: currentTheme.borderColor, 
                  true: currentTheme.accentColor 
                }}
                thumbColor={currentTheme.backgroundColor}
              />
            </View>
          </View>

          {/* Legal Section */}
          <View style={themedStyles.sectionContainer}>
            <Text style={themedStyles.sectionTitle}>Legal</Text>
            <TouchableOpacity 
              style={styles.legalRow}
              onPress={() => navigation.navigate('TermsAndConditions')}
            >
              <Ionicons 
                name="document-text" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>Terms & Conditions</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentTheme.accentColor} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.legalRow}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Ionicons 
                name="shield" 
                size={20} 
                color={currentTheme.accentColor} 
              />
              <Text style={themedStyles.infoText}>Privacy Policy</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentTheme.accentColor} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={themedStyles.logoutButton} 
            onPress={handleLogout}
          >
            <Ionicons 
              name="log-out" 
              size={20} 
              color={currentTheme.textColor} 
              style={styles.logoutIcon} 
            />
            <Text style={themedStyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
         <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.errorText, { color: currentTheme.errorColor }]}>
                  Failed to load profile data.
                </Text> </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default CustomerProfile;



