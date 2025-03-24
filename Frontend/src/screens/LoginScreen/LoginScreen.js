import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { currentTheme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.4:4500/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Login successful!');
        // Check role and navigate accordingly
        if (data.role === "admin") {
          navigation.navigate('AdminStack');
        } else {
          navigation.navigate('CustomerStack');
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Login Error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <Text style={[styles.title, { color: currentTheme.textColor }]}>Login</Text>
      
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
      
      <TouchableOpacity onPress={() => navigation.navigate('AdminStack')}>
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