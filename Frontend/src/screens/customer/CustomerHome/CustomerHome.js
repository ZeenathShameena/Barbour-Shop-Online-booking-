import { StyleSheet, Text, View } from 'react-native'
import {React, useEffect, useState} from 'react'

const CustomerHome = () => {
  const [client, setClient] = useState(null);

  // Function to fetch client details
  const fetchClientDetails = async () => {
    try {
      const response = await fetch("http://localhost:4500/api/auth/client", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      console.log("dscddscs           ",data)
      if (data.success) {
        setClient(data.data[0]); // Assuming the first entry is the client details
      }
    } catch (error) {
      console.error("Error fetching client profile details:", error);
    }
  };

  const notification= async () => {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const body = JSON.stringify({
          appId: 28467,
          appToken: "cGGzWGtIEOjd3vq5QVWVfP",
          title: "Gents Camp",
          body: "Hii",
          dateSent: Date.now
        });
        const response = await fetch(`https://app.nativenotify.com/api/notification`, {
            method: 'POST',
            headers: headers,
            body: body
        });
        const text = await response.text();
        console.log("Server response:", text); 
        if (text.includes("Success")) {
            console.log("Notification sent successfully!");
        } else {
            console.error("Unexpected response:", text);
        }
    } catch (error) {
        console.error("Error in notification:", error);
    }  
  }
  useEffect(() => {
    fetchClientDetails()
    notification()
  });
  
  return (
    <View>
      <Text>CustomerHome</Text>
    </View>
  )
}

export default CustomerHome

const styles = StyleSheet.create({})