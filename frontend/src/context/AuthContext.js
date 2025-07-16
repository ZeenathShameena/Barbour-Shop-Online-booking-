import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);  // Add this line to store the token

  // Check authentication status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is already logged in
  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      const storedUserId = await AsyncStorage.getItem('userId');

      console.log('Stored Token:', storedToken);
      console.log('Stored Role:', role);
      console.log('Stored User ID:', storedUserId);

      if (storedToken && role && storedUserId) {
        setIsAuthenticated(true);
        setUserRole(role);
        setUserId(storedUserId);
        setToken(storedToken);  // Set the token in state
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoading(false);
    }
  };

  // Login method
  const login = async (userToken, role, userId) => {
    try {
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(userId);
      setToken(userToken);  // Set the token in state
      console.log('Logged in:', userToken, role, userId);
    } catch (error) {
      console.error('Error storing login data:', error);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userId');
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setToken(null);  // Clear the token
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userId,
      isLoading,
      login,
      logout,
      token,  // Add token to the context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};