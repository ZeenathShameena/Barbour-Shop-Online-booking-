import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

const CustomerSlotBooking = () => {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const { selectedCategory } = route.params;


  console.log(selectedCategory.title)


  // Fetch slots from API
  const fetchSlots = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'https://gents-camp.onrender.com/api/slot/get-slots'
      )
      const jsonResponse = await response.json()

      if (response.ok) {
        setSlots(jsonResponse || [])
      } else {
        console.error('Failed to fetch slots:', jsonResponse.message)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  // Handle slot booking (to be implemented later)
  const handleSlotBooking = (slot) => {
    if (slot.isBooked) {
      alert('This slot is already booked.')
    } else {
      alert(`Slot selected: ${slot.slot}`)
      // Implement slot booking API call here if needed
    }
  }

  // Render each slot item
  const renderSlot = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.slotCard,
        item.isBooked ? styles.slotBooked : styles.slotAvailable
      ]}
      onPress={() => handleSlotBooking(item)}
      disabled={item.isBooked}
    >
      <Text style={styles.slotText}>{item.slot}</Text>
      {item.isBooked ? (
        <Text style={styles.bookedText}>Booked</Text>
      ) : (
        <Text style={styles.availableText}>Available</Text>
      )}
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Slots</Text>
      {slots.length === 0 ? (
        <Text style={styles.noSlots}>No slots available!</Text>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item._id}
          renderItem={renderSlot}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default CustomerSlotBooking

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 15,
    paddingTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  noSlots: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20
  },
  listContainer: {
    paddingBottom: 20
  },
  slotCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  slotAvailable: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1
  },
  slotBooked: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D32F2F',
    borderWidth: 1
  },
  slotText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  bookedText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600'
  },
  availableText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600'
  }
})
