import React from 'react';
import { ThemeProvider } from './../src/context/ThemeContext'
 import { AuthProvider } from './../src/context/AuthContext';;
import StackNavigator from '../src/routes/main';

export default function App() {
  return (
     <AuthProvider>
    <ThemeProvider>
      <StackNavigator />
    </ThemeProvider>
    </AuthProvider>
  );
}
