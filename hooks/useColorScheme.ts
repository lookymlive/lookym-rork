import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightColors = {
  primary: '#2F95DC',
  primaryLight: '#98CEFF',
  secondary: '#77777C',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#9A9A9A',
  border: '#E0E0E0',
  error: '#D32F2F',
  errorLight: '#FFC2CB',
  success: '#4CAF50',
  warning: '#FFEB3B',
  disabled: '#A0A0A0',
};

const darkColors = {
  primary: '#5772E4',
  primaryLight: '#3A316B',
  secondary: '#A0A0A0',
  background: '#1A202C',
  card: '#2D3748',
  text: '#FFFFFF',
  textSecondary: '#A0A0CB',
  border: '#4A5568',
  error: '#E53E3E',
  errorLight: '#4A2121',
  success: '#68D391',
  warning: '#F6E05E',
  disabled: '#6B7280',
};

export function useColorSchema() {
  const nativeColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(nativeColorScheme === 'dark');

  useEffect(() => {
    // Load preference from storage
    const loadColorScheme = async () => {
      try {
        const storedSchema = await AsyncStorage.getItem('colorScheme');
        if (storedSchema !== null) {
          setIsDark(storedSchema === 'dark');
        } else {
          setIsDark(nativeColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load color scheme preference: ', error);
      }
    };

    loadColorScheme();
  }, [nativeColorScheme]);

  const toggleColorScheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);

    try {
      await AsyncStorage.setItem('colorScheme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save color scheme preference: ', error);
    }
  };

  return {
    isDark,
    colorScheme: isDark ? 'dark' : 'light',
    colors: isDark ? darkColors : lightColors,
    toggleColorScheme,
  };
}