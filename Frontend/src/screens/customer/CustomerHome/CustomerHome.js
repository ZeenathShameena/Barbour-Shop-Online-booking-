import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from 'react-native'
import { useShopStatus } from '../../../context/ShopStatusContext'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../../../context/ThemeContext'

const { width } = Dimensions.get('window')

export const CustomerHome = () => {
  const { shopStatus, fetchShopStatus } = useShopStatus()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const { currentTheme } = useTheme()

  // Fetch categories based on shop status
  const fetchCategories = async () => {
    if (shopStatus === 'open') {
      try {
        setLoadingCategories(true)
        const response = await fetch(
          'https://gents-camp.onrender.com/api/admin/categories'
        )
        const jsonResponse = await response.json()

        if (response.ok && jsonResponse?.success) {
          setCategories(jsonResponse.existingcategory || [])
        } else {
          console.error('Failed to fetch categories:', jsonResponse.message)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
  }

  // Fetch categories when the shop is open or on refresh
  useEffect(() => {
    fetchCategories()
  }, [shopStatus])

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchShopStatus() // Fetch latest shop status
    await fetchCategories() // Fetch categories if shop is open
    setRefreshing(false)
  }

  // Function to get category images
  const getCategoryImage = (title) => {
    const categoryImages = {
      Haircut: require('../../../assets/images/haircut.jpg'),
      Shaving: require('../../../assets/images/shaving.jpg'),
      Combo: require('../../../assets/images/combo.jpg'),
      kids: require('../../../assets/images/kids.jpg')
    }
    return categoryImages[title]
  }

  // Category Card Component
  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard, 
        { 
          backgroundColor: currentTheme.cardColor, 
          shadowColor: currentTheme.shadowColor 
        }
      ]}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('SlotBooking', { selectedCategory: item.title })
      }
    >
      <View style={styles.cardContent}>
        <Image
          source={getCategoryImage(item.title)}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.categoryTextContainer}>
          <Text style={[styles.categoryTitle, { color: currentTheme.textColor }]}>
            {item.title}
          </Text>
          <Text style={[styles.categoryPrice, { color: currentTheme.successColor }]}>
            ₹{item.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (shopStatus === null) {
    return (
      <View 
        style={[
          styles.loadingContainer, 
          { backgroundColor: currentTheme.backgroundColor }
        ]}
      >
        <ActivityIndicator 
          size="large" 
          color={currentTheme.accentColor} 
        />
      </View>
    )
  }

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: currentTheme.backgroundColor }
      ]}
    >
      {shopStatus === 'open' ? (
        <>
          {loadingCategories ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator 
                size="large" 
                color={currentTheme.accentColor} 
              />
            </View>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CategoryCard item={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[currentTheme.accentColor]}
                />
              }
            />
          )}
        </>
      ) : (
        <View style={styles.closedContainer}>
          <Text 
            style={[
              styles.statusClosed, 
              { color: currentTheme.errorColor }
            ]}
          >
            🚫 Shop is Closed
          </Text>
          <Text 
            style={[
              styles.closedSubtext, 
              { color: currentTheme.textColor }
            ]}
          >
            We'll be back soon!
          </Text>
          <TouchableOpacity 
            style={[
              styles.refreshButton, 
              { backgroundColor: currentTheme.buttonColor }
            ]} 
            onPress={onRefresh}
          >
            <Text style={styles.refreshText}>🔄 Refresh Status</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusClosed: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  closedSubtext: {
    fontSize: 16,
    marginBottom: 20
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  refreshText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold'
  },
  listContent: {
    paddingBottom: 20
  },
  categoryCard: {
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  categoryTextContainer: {
    flex: 1,
    marginLeft: 15
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  categoryPrice: {
    fontSize: 18,
    fontWeight: '600'
  }
})

export default CustomerHome