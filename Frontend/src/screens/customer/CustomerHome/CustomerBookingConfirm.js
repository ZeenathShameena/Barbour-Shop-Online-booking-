import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from './../../../context/ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const BookingConfirmation = ({ route }) => {
  const { slotId, selectedCategory, slotTime } = route.params
  const [isBooking, setIsBooking] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState(false)
  const navigation = useNavigation()
  const { userId } = useAuth()
  const { currentTheme } = useTheme()
  
  // Request notification permissions on component mount
  useEffect(() => {
    registerForPushNotificationsAsync().then(status => {
      setNotificationPermission(status === 'granted');
    });
  }, []);

  // Parse the slot time to create a notification
  const scheduleNotification = async () => {
    if (!notificationPermission) {
      console.log('Notification permission not granted');
      return;
    }

    try {
      // Parse the slotTime string to a Date object
      // This assumes slotTime is in a format like "April 5, 2025 10:30 AM"
      const appointmentTime = new Date(slotTime);
      
      // Calculate reminder time (15 minutes before appointment)
      const reminderTime = new Date(appointmentTime.getTime() - 15 * 60 * 1000);
      
      // Current time for comparison
      const now = new Date();
      
      // Only schedule if the reminder time is in the future
      if (reminderTime > now) {
        const schedulingOptions = {
          content: {
            title: 'Appointment Reminder',
            body: `Your ${selectedCategory} appointment is in 15 minutes!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { slotId, selectedCategory, slotTime },
          },
          trigger: { date: reminderTime },
        };
        
        const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
        console.log('Notification scheduled:', notificationId);
        return notificationId;
      } else {
        console.log('Reminder time has already passed');
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const confirmBooking = async () => {
    try {
      setIsBooking(true)
      const response = await fetch(
        'https://gents-camp.onrender.com/api/slot/book-slot',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            slotId: slotId,
            selectedCategory: selectedCategory
          })
        }
      )

      const result = await response.json()

      if (response.ok) {
        // Schedule the notification after successful booking
        const notificationId = await scheduleNotification();
        
        Alert.alert(
          'Booking Successful',
          'Your slot has been booked successfully! You will receive a reminder 15 minutes before your appointment.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('CustomerStack', {
                screen: 'Bookings'
              })
            }
          ]
        )
      } else {
        throw new Error(result.message || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking Error:', error)
      Alert.alert(
        'Booking Failed',
        error.message || 'Unable to book slot. Please try again.'
      )
    } finally {
      setIsBooking(false)
    }
  }

  // Function to request notification permissions
  async function registerForPushNotificationsAsync() {
    let token;
    
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Notification permission is needed to send you appointment reminders.',
          [{ text: 'OK' }]
        );
        return finalStatus;
      }
      
      // Only get the token on actual devices
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
    } else {
      console.log('Must use physical device for push notifications');
    }

    return finalStatus;
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View 
        style={[
          styles.confirmationCard, 
          { 
            backgroundColor: currentTheme.cardColor || currentTheme.inputBackground,
            borderColor: currentTheme.borderColor,
            shadowColor: currentTheme.shadowColor || '#000000'
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons 
            name="calendar-check" 
            size={32} 
            color={currentTheme.accentColor || currentTheme.buttonColor} 
          />
          <Text style={[styles.headerText, { color: currentTheme.textColor }]}>
            Booking Details
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconWrapper}>
              <MaterialCommunityIcons 
                name="tag" 
                size={24} 
                color={currentTheme.accentColor || currentTheme.buttonColor} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: currentTheme.textColor }]}>
                Service Category
              </Text>
              <Text 
                style={[
                  styles.detailValue, 
                  { color: currentTheme.primaryColor || currentTheme.textColor }
                ]}
              >
                {selectedCategory}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconWrapper}>
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={24} 
                color={currentTheme.accentColor || currentTheme.buttonColor} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: currentTheme.textColor }]}>
                Time Slot
              </Text>
              <Text 
                style={[
                  styles.detailValue, 
                  { color: currentTheme.primaryColor || currentTheme.textColor }
                ]}
              >
                {slotTime}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: currentTheme.buttonColor }]}
            onPress={confirmBooking}
            disabled={isBooking}
          >
            {isBooking ? (
              <ActivityIndicator color="#333333" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#333333" />
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cancelButton, 
              { borderColor: currentTheme.errorColor || '#FF3B30' }
            ]}
            onPress={() => navigation.goBack()}
            disabled={isBooking}
          >
            <MaterialCommunityIcons 
              name="close-circle" 
              size={20} 
              color={currentTheme.errorColor || '#FF3B30'} 
            />
            <Text style={[
              styles.cancelButtonText, 
              { color: currentTheme.errorColor || '#FF3B30' }
            ]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  confirmationCard: {
    width: '92%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 24
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 16
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 20,
    marginBottom: 24
  },
  detailsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 20
  },
  detailIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center'
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    opacity: 0.7
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonGroup: {
    paddingHorizontal: 24,
    gap: 14
  },
  confirmButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8
  },
  cancelButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  }
})

export default BookingConfirmation