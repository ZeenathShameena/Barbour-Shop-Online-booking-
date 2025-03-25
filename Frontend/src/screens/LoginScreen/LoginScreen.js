import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { currentTheme } = useTheme();

  // Check token and auto-login
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const role = await AsyncStorage.getItem('userRole');

      if (token) {
        console.log('Token found, auto-login with role:', role);
        
        // Navigate based on stored role
        if (role === 'admin') {
          navigation.replace('AdminStack');
        } else {
          navigation.replace('CustomerStack');
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Handle login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch(
        'https://gents-camp.onrender.com/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const role = data.role; // Store the role too

        // Store token and role in AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userRole', role);

        Alert.alert('Success', 'Login successful!');
        console.log('Token & Role saved:', token, role);

        // Navigate based on the user's role
        if (role === 'admin') {
          navigation.replace('AdminStack');
        } else {
          navigation.replace('CustomerStack');
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Login Error:', error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor }
      ]}
    >
      <Text style={[styles.title, { color: currentTheme.textColor }]}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={currentTheme.placeholderColor}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          {
            borderColor: currentTheme.borderColor,
            color: currentTheme.inputTextColor,
            backgroundColor: currentTheme.inputBackground
          }
        ]}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={currentTheme.placeholderColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[
            styles.passwordInput,
            {
              borderColor: currentTheme.borderColor,
              color: currentTheme.inputTextColor,
              backgroundColor: currentTheme.inputBackground
            }
          ]}
        />
        <TouchableOpacity
          style={[
            styles.eyeButton,
            {
              backgroundColor: currentTheme.inputBackground,
              borderColor: currentTheme.borderColor
            }
          ]}
          onPress={togglePasswordVisibility}
        >
          <Text style={{ color: currentTheme.textColor }}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: currentTheme.buttonColor }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: '#333333' }]}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.registerText, { color: currentTheme.linkColor }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15
  },
  passwordContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    position: 'relative'
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerText: {
    marginTop: 10,
    textAlign: 'center'
  }
});

export default LoginScreen;
