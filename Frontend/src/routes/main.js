import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Screens
import LoginScreen from './../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';

import AdminHome from '../screens/admin/AdminHome/AdminHome';
import AdminBookings from '../screens/admin/AdminBookings/AdminBookings';
import AdminProfile from '../screens/admin/AdminProfile/AdminProfile';
import CustomerList from '../screens/admin/CustomerList/CustomerList';

import CustomerHome from '../screens/customer/CustomerHome/CustomerHome';
import CustomerBookings from '../screens/customer/CustomerBookings/CustomerBookings';
import CustomerProfile from '../screens/customer/CustomerProfile/CustomerProfile';
import CustomerSlotBooking from '../screens/customer/CustomerHome/CustomerSlotBooking';
import CustomerBookingConfirm from '../screens/customer/CustomerHome/CustomerBookingConfirm';

import TermsAndConditions from './../screens/Legal/TermsAndConditions'
import PrivacyPolicy from './../screens/Legal/PrivacyPolicy'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// -------------------- Admin Stack --------------------
const AdminStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Bookings') {
            iconName = 'calendar';
          }
          else if (route.name === 'Customers') {
            iconName = 'users';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AdminHome} />
      <Tab.Screen name="Bookings" component={AdminBookings} />
      <Tab.Screen name="Customers" component={CustomerList} />
      <Tab.Screen name="Profile" component={AdminProfile} />
    </Tab.Navigator>
  );
};

// -------------------- Customer Stack --------------------
const CustomerStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Bookings') {
            iconName = 'calendar';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={CustomerHome} />
      <Tab.Screen name="Bookings" component={CustomerBookings} />
      <Tab.Screen name="Profile" component={CustomerProfile} />
    </Tab.Navigator>
  );
};

// -------------------- Main Stack Navigator --------------------
const StackNavigator = () => {
  const { login, isAuthenticated, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        const userId = await AsyncStorage.getItem('userId');

        if (token && role) {
          // Use login method from AuthContext to set authentication state
          await login(token, role, userId);
          
          if (role === 'admin') {
            setInitialRoute('AdminStack');
          } else {
            setInitialRoute('CustomerStack');
          }
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* Main app stacks */}
      <Stack.Screen 
        name="AdminStack" 
        component={AdminStack} 
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="CustomerStack" 
        component={CustomerStack} 
        options={{ gestureEnabled: false }}
      />
      
      {/* Additional screens */}
      <Stack.Screen name='SlotBooking' component={CustomerSlotBooking} />
      <Stack.Screen name='BookingConfirmation' component={CustomerBookingConfirm} />
      <Stack.Screen name ="TermsAndConditions" component={TermsAndConditions}/>
      <Stack.Screen name ="PrivacyPolicy" component={PrivacyPolicy}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;