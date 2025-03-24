import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance, AppState } from 'react-native';
import { theme } from '../../src/utils/ThemeColors'; // Import the theme object

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize with the current system theme
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark'
  );

  // Get the current theme based on the mode
  const currentTheme = isDarkMode ? theme.Dark : theme.Light;

  // Function to manually toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Function to sync with system theme
  const updateThemeFromSystem = () => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');
  };

  useEffect(() => {
    // Set up listener for appearance changes
    const subscription = Appearance.addChangeListener(updateThemeFromSystem);

    // Set up AppState listener to update theme when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        updateThemeFromSystem();
      }
    });

    // Clean up subscriptions
    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use ThemeContext
export const useTheme = () => useContext(ThemeContext);