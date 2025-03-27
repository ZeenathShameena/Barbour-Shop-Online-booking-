import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { useShopStatus } from '../../../context/ShopStatusContext'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const CustomerHome = () => {
  const { shopStatus, fetchShopStatus } = useShopStatus()
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const navigation = useNavigation()

  const fetchCategories = async () => {
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

  useEffect(() => {
    if (shopStatus === 'open') {
      fetchCategories()
    }
  }, [shopStatus])

  // Function to get category images
  const getCategoryImage = (title) => {
    const categoryImages = {
      Haircut: require('../../../assets/images/haircut.jpg'),
      Shaving: require('../../../assets/images/shaving.jpg'),
      Combo: require('../../../assets/images/combo.jpg'),
      Kids: require('../../../assets/images/kids.jpg')
    }
    return categoryImages[title] 
  }

  // Category Card Component
  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('SlotBooking', { selectedCategory: item })}
   >
      <View style={styles.cardContent}>
        <Image
          source={getCategoryImage(item.title)}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <Text style={styles.categoryPrice}>₹{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (shopStatus === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {shopStatus === 'open' ? (
        <>
          {loadingCategories ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <CategoryCard item={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <View style={styles.closedContainer}>
          <Text style={styles.statusClosed}>🚫 Shop is Closed</Text>
          <Text style={styles.closedSubtext}>We'll be back soon!</Text>
        </View>
      )}
    </View>
  )
}

export default CustomerHome

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
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC'
  },
  statusClosed: {
    fontSize: 24,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 10
  },
  closedSubtext: {
    fontSize: 16,
    color: '#757575'
  },
  listContent: {
    paddingBottom: 20
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
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
    color: '#333',
    marginBottom: 8
  },
  categoryPrice: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600'
  }
})
