import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../../../context/ThemeContext'

const { width } = Dimensions.get('window')

const CustomerSlotBooking = ({ route }) => {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const { selectedCategory } = route.params
  const navigation = useNavigation()
  const { currentTheme } = useTheme()
  

  console.log('1',selectedCategory)
  const fetchSlots = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        'https://gents-camp.onrender.com/api/slot/get-slots'
      )
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
      const jsonResponse = await response.json()
      
      const combinedSlots = [
        ...jsonResponse.availableSlots.map(slot => ({
          ...slot,
          isBooked: false
        })),
        ...jsonResponse.bookedSlots.map(slot => ({
          ...slot,
          isBooked: true
        }))
      ]
      
      const sortedSlots = combinedSlots.sort((a, b) => {
        const timeA = a.slot.split('-')[0].trim()
        const timeB = b.slot.split('-')[0].trim()
        return timeA.localeCompare(timeB)
      })
      
      setSlots(sortedSlots)
    } catch (error) {
      console.error('Error fetching slots:', error)
      alert('Failed to fetch slots. Please try again later.')
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const handleSlotBooking = (slot) => {
 
    if (slot.isBooked) {
      alert('This slot is already booked.')
      return
    }
    
    navigation.navigate('BookingConfirmation', {
      slotId: slot._id,
      slotTime:slot.slot,
      selectedCategory
    })
  }

  const renderSlot = ({ item }) => {
    const isBooked = item.isBooked
    const primaryColor = isBooked 
      ? currentTheme.errorColor 
      : currentTheme.successColor
    const backgroundColor = isBooked 
      ? currentTheme.errorColor + '10' 
      : currentTheme.successColor + '10'

    return (
      <View 
        style={[
          styles.slotContainer, 
          { 
            backgroundColor: currentTheme.backgroundColor,
            borderColor: currentTheme.primaryColor + '30'
          }
        ]}
      >
        <View style={styles.slotHeader}>
          <View 
            style={[
              styles.slotIndicator, 
              { backgroundColor: primaryColor }
            ]}
          />
          <Text 
            style={[
              styles.slotTimeText, 
              { color: currentTheme.textColor }
            ]}
          >
            {item.slot}
          </Text>
        </View>
        
        <View style={styles.slotFooter}>
          <Text 
            style={[
              styles.slotStatusText, 
              { color: primaryColor }
            ]}
          >
            {isBooked ? 'Booked' : 'Available'}
          </Text>
          
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => handleSlotBooking(item)}
            disabled={isBooked}
          >
            <Text 
              style={[
                styles.bookButtonText,
                { 
                  color: isBooked 
                    ? currentTheme.errorColor 
                    : currentTheme.successColor 
                }
              ]}
            >
              {isBooked ? 'Unavailable' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView 
        style={[
          styles.loadingContainer, 
          { backgroundColor: currentTheme.backgroundColor }
        ]}
      >
        <ActivityIndicator 
          size="large" 
          color={currentTheme.accentColor} 
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: currentTheme.backgroundColor }
      ]}
    >
      <View 
        style={[
          styles.headerContainer,
          { backgroundColor: currentTheme.backgroundColor }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            color={currentTheme.textColor} 
            size={24} 
          />
        </TouchableOpacity>
        <Text 
          style={[
            styles.headerTitle, 
            { color: currentTheme.textColor }
          ]}
        >
          Available Slots
        </Text>
      </View>

      {slots.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={100} 
            color={currentTheme.textColor + '30'} 
          />
          <Text 
            style={[
              styles.emptyStateText, 
              { color: currentTheme.textColor }
            ]}
          >
            No slots available!
          </Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item._id}
          renderItem={renderSlot}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

export default CustomerSlotBooking

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 18,
    marginTop: 20,
    opacity: 0.7
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  slotContainer: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  slotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  slotTimeText: {
    fontSize: 16,
    fontWeight: '500'
  },
  slotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotStatusText: {
    fontSize: 14,
    fontWeight: '600'
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600'
  }
})