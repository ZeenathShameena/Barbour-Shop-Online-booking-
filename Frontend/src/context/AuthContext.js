// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin details
  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(
        'http://localhost:4500/api/admin/details/67de501a758770759db45232'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch admin details');
      }

      const data = await response.json();
      setAdminDetails(data);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load admin data when the component mounts
  useEffect(() => {
    fetchAdminDetails();
  }, []);

  return (
    <AuthContext.Provider value={{ adminDetails, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
