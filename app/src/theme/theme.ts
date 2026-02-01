/**
 * Theme System
 * 
 * Defines colors, typography, spacing, and other design tokens
 * for The Golden Chariot of Belintash
 */

export const theme = {
  // Colors
  colors: {
    // Primary (Gold - representative of the Golden Chariot)
    primary: '#DAA520', // Goldenrod
    primaryDark: '#B8860B', // Dark Goldenrod
    primaryLight: '#FFD700', // Gold
    
    // Secondary (Deep Blue - Bulgarian night sky)
    secondary: '#1E3A5F',
    secondaryDark: '#0F1E30',
    secondaryLight: '#2C5F8D',
    
    // Accent (Crimson - blood, danger, passion)
    accent: '#DC143C',
    accentDark: '#B22234',
    accentLight: '#FF4757',
    
    // Neutrals
    black: '#0A0A0A',
    darkGray: '#1A1A1A',
    gray: '#424242',
    lightGray: '#BDBDBD',
    offWhite: '#F5F5F5',
    white: '#FFFFFF',
    
    // Semantic colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // UI colors
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceLight: '#2A2A2A',
    border: '#424242',
    text: '#F5F5F5',
    textSecondary: '#BDBDBD',
    textDisabled: '#757575',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
    
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing (based on 4px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

export type Theme = typeof theme;

// Theme context for runtime theme switching
import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    // TODO: Persist theme preference
  };
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
