import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const AdminBookedSlots = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await fetch('https://gents-camp.onrender.com/api/slot/get-slots');
        const data = await response.json();
        
        // Filter and set only booked slots
        setBookedSlots(data.bookedSlots);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch booked slots');
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, []);

  const renderBookedSlotItem = ({ item }) => (
    <View style={[styles.slotContainer, { 
      backgroundColor: currentTheme.cardColor, 
      shadowColor: currentTheme.shadowColor
    }]}>
      <View style={styles.slotDetails}>
        <Text style={[styles.slotTime, { color: currentTheme.textColor }]}>
          {item.slot}
        </Text>
        <Text style={[styles.bookedBy, { color: currentTheme.placeholderColor }]}>
          Booked by: {item.bookedBy?.name || 'Unknown User'}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Booked</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: currentTheme.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentTheme.buttonColor} />
        <Text style={{ color: currentTheme.textColor }}>Loading booked slots...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: currentTheme.backgroundColor }]}>
        <Text style={[styles.errorText, { color: currentTheme.errorColor }]}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Text style={[styles.title, { color: currentTheme.textColor }]}>
        Booked Slots
      </Text>
      
      {bookedSlots.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.noSlotsText, { color: currentTheme.placeholderColor }]}>
            No slots are currently booked.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookedSlots}
          keyExtractor={(item) => item._id}
          renderItem={renderBookedSlotItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  slotDetails: {
    flex: 1,
    marginRight: 16,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookedBy: {
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noSlotsText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
  },
});

export default AdminBookedSlots;