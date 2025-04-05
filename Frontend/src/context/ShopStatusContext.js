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
      
      if (response.ok) {
        const jsonResponse = await response.json()
        console.log('JSON response:', jsonResponse)
        
        // Corrected key name to lowercase
        const status = jsonResponse?.status?.[0]?.status?.toLowerCase()
        
        setShopStatus(status)
        console.log('Status of shop:', status)
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
