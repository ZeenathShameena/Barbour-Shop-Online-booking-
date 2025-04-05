import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomerBookingPage = () => {
  const { userId } = useAuth();
  const { currentTheme } = useTheme();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserSlots();
  }, []);

  const fetchUserSlots = async () => {
    try {
      const response = await fetch(
        `https://gents-camp.onrender.com/api/slot/get-user-slot/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      if (response.ok) {
        setSlots(data || []);
        console.log("Fetched slots:", data)
      } else {
        console.error('Error fetching slots:', data.message);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: currentTheme.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentTheme.accentColor} />
      </View>
    );
  }

  const renderSlotItem = ({ item }) => (
    <View 
      style={[
        styles.slotCard, 
        { 
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          shadowColor: currentTheme.shadowColor
        }
      ]}
    >
      <View style={styles.slotHeader}>
        <MaterialCommunityIcons 
          name="tag" 
          size={22} 
          color={currentTheme.accentColor} 
          style={styles.categoryIcon}
        />
        <Text style={[styles.slotCategory, { color: currentTheme.textColor }]}>
          {item.selectedCategory}
        </Text>
      </View>
      
      <View style={[styles.slotDetails, { borderTopColor: currentTheme.borderColor }]}>
        <Text style={[styles.slotText, { color: currentTheme.textColor }]}>
          Slot: {item.slot}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View style={[styles.headerSection, { backgroundColor: currentTheme.newheaderColor }]}>
        <MaterialCommunityIcons 
          name="calendar-check" 
          size={24} 
          color={currentTheme.accentColor} 
        />
        <Text style={[styles.title, { color: currentTheme.textColor }]}>
          Your Bookings
        </Text>
      </View>
      
      {slots.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="calendar-blank" 
            size={60} 
            color={currentTheme.borderColor} 
          />
          <Text style={[styles.emptyStateText, { color: currentTheme.textColor }]}>
            No bookings found
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: currentTheme.placeholderColor }]}>
            You haven't booked any services yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item._id}
          renderItem={renderSlotItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  slotCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    marginRight: 8,
  },
  slotCategory: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  slotDetails: {
    padding: 16,
    borderTopWidth: 1,
  },
  slotText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomerBookingPage;