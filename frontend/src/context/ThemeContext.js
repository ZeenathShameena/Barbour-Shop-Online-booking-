// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { Appearance, AppState } from 'react-native';
// import { theme } from '../../src/utils/ThemeColors'; // Import the theme object

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // Initialize with the current system theme
//   const [isDarkMode, setIsDarkMode] = useState(
//     Appearance.getColorScheme() === 'dark'
//   );

//   // Get the current theme based on the mode
//   const currentTheme = isDarkMode ? theme.Dark : theme.Light;

//   // Function to manually toggle theme
//   const toggleTheme = () => {
//     setIsDarkMode((prev) => !prev);
//   };

//   // Function to sync with system theme
//   const updateThemeFromSystem = () => {
//     const colorScheme = Appearance.getColorScheme();
//     setIsDarkMode(colorScheme === 'dark');
//   };

//   useEffect(() => {
//     // Set up listener for appearance changes
//     const subscription = Appearance.addChangeListener(updateThemeFromSystem);

//     // Set up AppState listener to update theme when app comes to foreground
//     const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         updateThemeFromSystem();
//       }
//     });

//     // Clean up subscriptions
//     return () => {
//       subscription.remove();
//       appStateSubscription.remove();
//     };
//   }, []);

//   return (
//     <ThemeContext.Provider value={{ currentTheme, isDarkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Custom hook to use ThemeContext
// export const useTheme = () => useContext(ThemeContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../src/utils/ThemeColors'; // Import the theme object

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize with a default theme, will be updated from AsyncStorage
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the current theme based on the mode
  const currentTheme = isDarkMode ? theme.Dark : theme.Light;

  // Function to manually toggle theme and save to AsyncStorage
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      // Save the new theme preference to AsyncStorage
      await AsyncStorage.setItem('theme:isDarkMode', JSON.stringify(newMode));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Load theme preference from AsyncStorage when component mounts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme:isDarkMode');
        
        if (storedTheme !== null) {
          // If a theme preference exists in storage, use it
          setIsDarkMode(JSON.parse(storedTheme));
        } else {
          // Otherwise set a default and save it
          setIsDarkMode(false);
          await AsyncStorage.setItem('theme:isDarkMode', JSON.stringify(false));
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Default to light theme if there's an error
        setIsDarkMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Provide a value to pass through the context
  const contextValue = {
    currentTheme,
    isDarkMode,
    toggleTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use ThemeContext
export const useTheme = () => useContext(ThemeContext);