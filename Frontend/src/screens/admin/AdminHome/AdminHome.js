import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'

const AdminHome = () => {
  const [status, setStatus] = useState('')
  const [closingTime, setClosingTime] = useState('17:00')

  // Get current time in 'hh:mm' format
  const getCurrentTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes()
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedHours = hours < 10 ? `0${hours}` : hours
    return `${formattedHours}:${formattedMinutes}`
  }

  const handleOpen = async () => {
    const openingTime = getCurrentTime()

    if (!closingTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
      Alert.alert('Invalid Time', 'Please enter a valid closing time in HH:mm format.')
      return
    }

    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/set-open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openingTime: openingTime,
          closingTime: closingTime,
        }),
      })

      const jsonResponse = await response.json()
      console.log('Open API Response:', jsonResponse)

      if (response.ok) {
        setStatus('Open')
        Alert.alert('Success', `The shop is now open. Closing time is set to ${closingTime}.`)
      } else {
        Alert.alert('Error', 'Failed to set shop as open.')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.')
      console.error('Open API Error:', error)
    }
  }

  const handleClose = async () => {
    const closingTime = getCurrentTime()

    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/set-close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          closingTime: closingTime,
        }),
      })

      const jsonResponse = await response.json()
      console.log('Close API Response:', jsonResponse)

      if (response.ok) {
        setStatus('Closed')
        Alert.alert('Success', `The shop is now closed at ${closingTime}.`)
      } else {
        Alert.alert('Error', 'Failed to set shop as closed.')
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.')
      console.error('Close API Error:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Shop Management</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.labelText}>Current Status:</Text>
          <Text style={[
            styles.statusText, 
            status === 'Open' ? styles.openStatus : styles.closedStatus
          ]}>
            {status || 'Unknown'}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Closing Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:mm"
            value={closingTime}
            onChangeText={(text) => setClosingTime(text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.openButton]} 
            onPress={handleOpen}
          >
            <Text style={styles.buttonText}>Open Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.closeButton]} 
            onPress={handleClose}
          >
            <Text style={styles.buttonText}>Close Shop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  labelText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  openStatus: {
    color: '#27ae60',
  },
  closedStatus: {
    color: '#e74c3c',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  openButton: {
    backgroundColor: '#2ecc71',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
})