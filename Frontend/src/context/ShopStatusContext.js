// ShopStatusContext.js
import React, { createContext, useState, useContext, useEffect } from 'react'

// Create the context
const ShopStatusContext = createContext()

// Context Provider
export const ShopStatusProvider = ({ children }) => {
  const [shopStatus, setShopStatus] = useState(null)

  // Fetch shop status from API
  const fetchShopStatus = async () => {
    try {
      const response = await fetch('https://gents-camp.onrender.com/api/admin/shop-status')
      const jsonResponse = await response.json()

      console.log('Shop Status API Response:', jsonResponse)

      if (response.ok) {
        // Set the status correctly from the API response
        setShopStatus(jsonResponse?.Status?.[0]?.status?.toLowerCase())
      } else {
        console.error('Failed to fetch shop status')
      }
    } catch (error) {
      console.error('Error fetching shop status:', error)
    }
  }

  // Fetch status on component mount
  useEffect(() => {
    fetchShopStatus()
  }, [])

  return (
    <ShopStatusContext.Provider value={{ shopStatus, setShopStatus, fetchShopStatus }}>
      {children}
    </ShopStatusContext.Provider>
  )
}

// Custom hook to use the ShopStatusContext
export const useShopStatus = () => useContext(ShopStatusContext)
