import React from 'react';
import { ThemeProvider } from './../src/context/ThemeContext'
 import { AuthProvider } from './../src/context/AuthContext';;
import StackNavigator from '../src/routes/main';

import { ShopStatusProvider } from './../src/context/ShopStatusContext';

export default function App() {
 
  return (
     <AuthProvider>
      <ShopStatusProvider>
          <ThemeProvider>
              <StackNavigator />
          </ThemeProvider>
       </ShopStatusProvider>
    </AuthProvider>
  );
}
