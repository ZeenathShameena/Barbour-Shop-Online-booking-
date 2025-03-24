import React from 'react';
import { ThemeProvider } from './../src/context/ThemeContext'
import { AuthProvider } from './../src/context/AuthContext';;
import StackNavigator from '../src/routes/main';
import registerNNPushToken from 'native-notify'

export default function App() {
  registerNNPushToken( 28467, 'cGGzWGtIEOjd3vq5QVWVfP');
  return (
    <AuthProvider>
    <ThemeProvider>
      <StackNavigator />
    </ThemeProvider>
    </AuthProvider>
  );
}
