// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Check token and role from AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedRole = await AsyncStorage.getItem('userRole');

      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
        navigateToStack(storedRole);
      }
    };

    loadAuthData();
  }, []);

  // Handle login - store token and role
  const login = async (token, role) => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userRole', role);

    setToken(token);
    setRole(role);
    navigateToStack(role);
    console.log(token,role)
  };

  // Logout - clear all storage and navigate to login
  const logout = async () => {
    await AsyncStorage.clear();
    setToken(null);
    setRole(null);
    navigation.replace('Login');
  };

  // Navigate based on role
  const navigateToStack = (role) => {
    if (role === 'admin') {
      navigation.replace('AdminStack');
    } else {
      navigation.replace('CustomerStack');
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
