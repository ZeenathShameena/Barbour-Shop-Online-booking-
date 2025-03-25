import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'

const AdminHome = () => {
  const [status, setStatus] = useState('')
  const [closingTime] = useState('17:00')

  // Get current time in 'hh:mm A' format
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

    try {
      const response = await fetch('https://gents-camp.onrender.com/api/slot/set-open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openingTime: openingTime,
          closingTime:closingTime,
        }),
      })
      console.log (openingTime ,closingTime)

      const jsonResponse = await response.json()
      console.log('Open API Response:', jsonResponse)

      if (response.ok) {
        setStatus('Open')
        Alert.alert('Success', `The shop is now open at ${openingTime}.`)
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
      <Text style={styles.title}>Admin Home</Text>
      <Text style={styles.status}>Status: {status || 'Unknown'}</Text>

      <TouchableOpacity style={[styles.button, styles.open]} onPress={handleOpen}>
        <Text style={styles.buttonText}>Open Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.close]} onPress={handleClose}>
        <Text style={styles.buttonText}>Close Shop</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: 200,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  open: {
    backgroundColor: '#4CAF50',
  },
  close: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
