import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentTheme } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address!');
      return;
    }

    // Simple password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long!');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.7:4500/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        Alert.alert('Success', 'Registration Successful! 🎉');
        navigation.replace('Login');
      } else {
        Alert.alert('Error', data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error('Registration Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Text style={[styles.title, { color: currentTheme.textColor }]}>Register</Text>
      
      <TextInput
        placeholder="Full Name"
        placeholderTextColor={currentTheme.placeholderColor}
        value={name}
        onChangeText={setName}
        style={[
          styles.input, 
          {
            borderColor: currentTheme.borderColor,
            color: currentTheme.inputTextColor,
            backgroundColor: currentTheme.inputBackground
          }
        ]}
      />
      
      <TextInput
        placeholder="Email"
        placeholderTextColor={currentTheme.placeholderColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[
          styles.input, 
          {
            borderColor: currentTheme.borderColor,
            color: currentTheme.inputTextColor,
            backgroundColor: currentTheme.inputBackground
          }
        ]}
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
      
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={currentTheme.placeholderColor}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
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
          onPress={toggleConfirmPasswordVisibility}
        >
          <Text style={{ color: currentTheme.textColor }}>
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: currentTheme.buttonColor }]} 
        onPress={handleRegister}
      >
        <Text style={[styles.buttonText, { color: '#333333' }]}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.loginText, { color: currentTheme.linkColor }]}>
          Already have an account? Login
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
  loginText: {
    marginTop: 10,
    textAlign: 'center'
  }
});

export default RegisterScreen;