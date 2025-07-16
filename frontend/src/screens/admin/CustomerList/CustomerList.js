import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from '../../../context/ThemeContext';

const ClientListPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("https://gents-camp.onrender.com/api/auth/get-all-clients");
        const data = await response.json();
        if (data.success) {
          setClients(data.users);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: currentTheme.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentTheme.buttonColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Text style={[styles.header, { color: currentTheme.accentColor }]}> Client List</Text>
      <FlatList
        data={clients}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.card, { 
            backgroundColor: currentTheme.cardColor,
            shadowColor: currentTheme.accentColor,
            borderColor: currentTheme.accentColor
          }]}>
            <Text style={[styles.name, { color: currentTheme.textColor }]}>{item.name}</Text>
            <Text style={[styles.infoText, { color: currentTheme.placeholderColor }]}>📧 {item.email}</Text>
            {item.mobile && <Text style={[styles.infoText, { color: currentTheme.placeholderColor }]}>📞 {item.mobile}</Text>}
            {item.address && <Text style={[styles.infoText, { color: currentTheme.placeholderColor }]}>🏠 {item.address}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 3,
  },
});

export default ClientListPage;