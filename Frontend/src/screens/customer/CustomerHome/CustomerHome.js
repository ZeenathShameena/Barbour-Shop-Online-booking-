import { StyleSheet, Text, View } from 'react-native'
import {React, useEffect, useState} from 'react'

const CustomerHome = () => {
  const [client, setClient] = useState()
  // Function to fetch client details
  const fetchClientDetails = async () => {
    try {
      const response = await fetch("http://192.168.1.4:4500/api/auth/client", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setClient(data.user); 
      }
    } catch (error) {
      console.error("Error fetching client profile details:", error);
    }
  };
  useEffect(() => {
      fetchClientDetails();
  }, []);  
  return (
    <View>
      <Text>CustomerHome</Text>
    </View>
  )
}

export default CustomerHome

const styles = StyleSheet.create({})