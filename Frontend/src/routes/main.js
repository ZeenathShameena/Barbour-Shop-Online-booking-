import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

// Screens
import LoginScreen from './../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';


import AdminHome from '../screens/admin/AdminHome/AdminHome';
import AdminBookings from '../screens/admin/AdminBookings/AdminBookings';
import AdminProfile from '../screens/admin/AdminProfile/AdminProfile';

import CustomerHome from '../screens/customer/CustomerHome/CustomerHome';
import CustomerBookings from '../screens/customer/CustomerBookings/CustomerBookings';
import CustomerProfile from '../screens/customer/CustomerProfile/CustomerProfile';
import CustomerSlotBooking from '../screens/customer/CustomerHome/CustomerSlotBooking';

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
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AdminHome} />
      <Tab.Screen name="Bookings" component={AdminBookings} />
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
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AdminStack" component={AdminStack} />
      <Stack.Screen name="CustomerStack" component={CustomerStack} />







      <Stack.Screen name='SlotBooking'component={CustomerSlotBooking}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;
