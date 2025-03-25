// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and role from AsyncStorage on app load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedToken) {
          setToken(storedToken);
          setUserRole(storedRole);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Save token and role in AsyncStorage and state
  const login = async (token, role) => {
    setToken(token);
    setUserRole(role);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userRole', role);
  };

  // Remove token and role from AsyncStorage and state
  const logout = async () => {
    setToken(null);
    setUserRole(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
