import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Animated, Easing } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useShopStatus } from '../../../context/ShopStatusContext'
import { useTheme } from '../../../context/ThemeContext'

const AdminHome = () => {
  // Get shop status from context
  const { shopStatus, setShopStatus } = useShopStatus()
  
  // Get current theme
  const { currentTheme } = useTheme()
  
  const [closingTime, setClosingTime] = useState('')
  const [openingTime, setOpeningTime] = useState('')
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  // Get current time in 'hh:mm' format
  const getCurrentTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedHours = hours < 10 ? `0${hours}` : hours
    return `${formattedHours}:${formattedMinutes}`
  }

  useEffect(() => {
    // Set default opening time to current time when component loads
    setOpeningTime(getCurrentTime())
    
    // Fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true
      })
    ]).start()
  }, [])

  const validateTime = (time) => {
    return time.match(/^([01]\d|2[0-3]):([0-5]\d)$/)
  }

  const handleOpen = async () => {
    // Only change shop status to open
    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/shop-open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const jsonResponse = await response.json()
      console.log('Open API Response:', jsonResponse)

      if (response.ok) {
        setShopStatus('Open') // Update context
        Alert.alert('Success', 'The shop is now open.')
      } else {
        Alert.alert('Error', jsonResponse.message || 'Failed to set shop as open.')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.')
      console.error('Open API Error:', error)
    }
  }

  const handleClose = async () => {
    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/shop-close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const jsonResponse = await response.json()
      console.log('Close API Response:', jsonResponse)

      if (response.ok) {
        setShopStatus('Closed') // Update context
        Alert.alert('Success', `The shop is now closed.`)
      } else {
        Alert.alert('Error', jsonResponse.message || 'Failed to set shop as closed.')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.')
      console.error('Close API Error:', error)
    }
  }

  const generateTimeSlots = async (startTime, endTime) => {
    if (!validateTime(startTime) || !validateTime(endTime)) {
      Alert.alert('Invalid Time', 'Please enter valid opening and closing times in HH:mm format.')
      return
    }

    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/generate-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openingTime: startTime,
          closingTime: endTime,
        }),
      })

      const jsonResponse = await response.json()
      console.log('Generate Slots API Response:', jsonResponse)

      if (response.ok) {
        Alert.alert('Success', 'Time slots have been generated successfully.')
      } else {
        Alert.alert('Error', jsonResponse.message || 'Failed to generate time slots.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate time slots.')
      console.error('Generate Slots API Error:', error)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Animated.View 
        style={[
          styles.card, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: currentTheme.cardColor,
            shadowColor: currentTheme.shadowColor, 
            borderColor: currentTheme.borderColor
          }
        ]}
      >
        <View style={[styles.header, { backgroundColor: currentTheme.newheaderColor }]}>
          <Text style={[styles.title, { color: currentTheme.textColor }]}>Gent's Camp</Text>
          <Text style={[styles.subtitle, { color: currentTheme.textColor }]}>Shop Management</Text>
        </View>
        
        <View style={[styles.statusContainer, { 
          backgroundColor: currentTheme === 'Light' ? '#f5f7ff' : currentTheme.headerColor,
          borderColor: currentTheme.borderColor 
        }]}>
          <Text style={[styles.labelText, { color: currentTheme.textColor }]}>Current Status</Text>
          <View style={[
            styles.statusIndicator, 
            shopStatus === 'open' ? 
              { backgroundColor: 'rgba(46, 204, 113, 0.2)', borderColor: currentTheme.successColor } : 
              { backgroundColor: 'rgba(231, 76, 60, 0.2)', borderColor: currentTheme.errorColor }
          ]}>
            <Text style={[
              styles.statusText,
              { color: shopStatus === 'open' ? currentTheme.successColor : currentTheme.errorColor }
            ]}>
              {shopStatus === 'open' ? 'OPEN' : 'CLOSED'}
            </Text>
          </View>
        </View>

        <View style={[styles.timeSection, { 
          backgroundColor: currentTheme === 'Light' ? '#f9fafd' : currentTheme.headerColor,
          borderColor: currentTheme.borderColor 
        }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.labelText, { color: currentTheme.textColor }]}>Opening Time</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.borderColor,
                  backgroundColor: currentTheme.inputBackground,
                  color: currentTheme.inputTextColor
                }]}
                placeholder="HH:mm"
                placeholderTextColor={currentTheme.placeholderColor}
                value={openingTime}
                onChangeText={(text) => setOpeningTime(text)}
                keyboardType="numbers-and-punctuation"
              />
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>🕒</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.labelText, { color: currentTheme.textColor }]}>Closing Time</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.borderColor,
                  backgroundColor: currentTheme.inputBackground,
                  color: currentTheme.inputTextColor
                }]}
                placeholder="HH:mm"
                placeholderTextColor={currentTheme.placeholderColor}
                value={closingTime}
                onChangeText={(text) => setClosingTime(text)}
                keyboardType="numbers-and-punctuation"
              />
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>🕘</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.openButton, { 
              backgroundColor: currentTheme.successColor,
              shadowColor: currentTheme.shadowColor
            }]} 
            onPress={handleOpen}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Open Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.closeButton, { 
              backgroundColor: currentTheme.errorColor,
              shadowColor: currentTheme.shadowColor
            }]} 
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Close Shop</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.generateButton, { 
            backgroundColor: currentTheme.accentColor,
            shadowColor: currentTheme.shadowColor 
          }]} 
          onPress={() => generateTimeSlots(openingTime, closingTime)}
          activeOpacity={0.8}
        >
          <Text style={[styles.generateButtonText, { color: '#333333' }]}>Generate Time Slots</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 25,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeSection: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
  },
  iconText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  openButton: {
    // Color now applied dynamically
  },
  closeButton: {
    // Color now applied dynamically
  },
  generateButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
  }
})