import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'

const AdminHome = () => {
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
