import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const AdminHome = () => {

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
          dateSent: "3-22-2025 3:16PM"
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
    notification()
  });
  return (
    <View>
      <Text>AdminHome</Text>
    </View>
  )
}

export default AdminHome

const styles = StyleSheet.create({})