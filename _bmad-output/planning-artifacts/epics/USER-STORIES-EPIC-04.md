# User Stories - Epic 4: UI Components
## The Golden Chariot of Belintash

**Epic:** Epic 4 - UI Components  
**Total Stories:** 3  
**Total Story Points:** 13 SP  
**Sprint:** Sprint 3  
**Priority:** High  
**Version:** 1.0  
**Date:** January 13, 2026

---

## Epic Overview

**Epic Goal:** Build reusable UI component library with consistent theming and accessibility.

**Epic Success Criteria:**
- Complete set of basic UI components (Button, Text, Modal, etc.)
- Game-specific UI components (HealthBar, StatDisplay, ChoiceCard)
- Consistent theming system
- Accessibility features (screen readers, color contrast)
- Responsive layouts for all screen sizes
- Performance optimized (60 FPS)
- Documentation with Storybook examples

**Dependencies:** 
- Epic 1 (Project Setup) - Complete
- Epic 2 (Core Game Engine) - Complete
- Epic 3 (State Management) - Complete

**Estimated Duration:** 3-5 days (Sprint 3)

---

## Table of Contents

- [Story 4.1: Build Basic UI Components](#story-41-build-basic-ui-components) ✓
- [Story 4.2: Build Game UI Components](#story-42-build-game-ui-components) ✓
- [Story 4.3: Create Screen Layouts](#story-43-create-screen-layouts) ✓

---

## Story 4.1: Build Basic UI Components

**Story ID:** 4.1  
**Story Points:** 5 SP  
**Priority:** Critical  
**Assignee:** Frontend Developer  
**Sprint:** Sprint 3  
**Dependencies:** Epic 1 complete

### User Story

> **As a** developer  
> **I want** reusable, themed UI components  
> **So that** I can build consistent interfaces quickly

### Detailed Description

Create a comprehensive library of basic UI components that will be used throughout the app. Components must be fully typed with TypeScript, follow React Native best practices, support theming, be accessible, and include proper error states and loading indicators.

These are the building blocks of every screen in the game. Quality here impacts the entire app, so components must be solid, well-tested, and easy to use.

### Acceptance Criteria

#### Must Have
- [ ] Button component (primary, secondary, ghost variants)
- [ ] Text component (with typography system)
- [ ] Input component (TextInput with validation)
- [ ] Modal component (with overlay)
- [ ] Card component (container with shadow)
- [ ] Divider component (horizontal/vertical)
- [ ] Spinner component (loading indicator)
- [ ] All components TypeScript typed
- [ ] Theme system implemented
- [ ] Dark mode support
- [ ] Accessibility labels
- [ ] Props documentation

#### Should Have
- [ ] TouchableOpacity wrapper with feedback
- [ ] IconButton component
- [ ] Checkbox component
- [ ] Switch component
- [ ] ProgressBar component
- [ ] Alert component
- [ ] Toast notification component

#### Nice to Have
- [ ] Storybook examples
- [ ] Animation support
- [ ] Gesture handlers
- [ ] Sound effects on interaction

### Technical Implementation

#### Step 1: Create Theme System

**File:** `src/theme/theme.ts`

```typescript
/**
 * Theme System
 * 
 * Defines colors, typography, spacing, and other design tokens
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
      // TODO: Add custom fonts (Cinzel for titles, Lora for body)
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
```

#### Step 2: Create Button Component

**File:** `src/components/ui/Button.tsx`

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Button Component
 * 
 * Reusable button with multiple variants
 */

export interface ButtonProps {
  // Content
  title: string;
  
  // Behavior
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Style
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Custom styles
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  
  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.primary,
          text: theme.colors.black,
          backgroundPressed: theme.colors.primaryDark,
        };
      case 'secondary':
        return {
          background: theme.colors.secondary,
          text: theme.colors.white,
          backgroundPressed: theme.colors.secondaryDark,
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: theme.colors.primary,
          backgroundPressed: theme.colors.surfaceLight,
        };
      case 'danger':
        return {
          background: theme.colors.error,
          text: theme.colors.white,
          backgroundPressed: theme.colors.accentDark,
        };
      default:
        return {
          background: theme.colors.primary,
          text: theme.colors.black,
          backgroundPressed: theme.colors.primaryDark,
        };
    }
  };
  
  // Determine size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          fontSize: theme.typography.fontSize.sm,
        };
      case 'md':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.typography.fontSize.base,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
          fontSize: theme.typography.fontSize.lg,
        };
      default:
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          fontSize: theme.typography.fontSize.base,
        };
    }
  };
  
  const colors = getColors();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.background,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: theme.borderRadius.md,
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        variant === 'ghost' && {
          borderWidth: 1,
          borderColor: theme.colors.primary,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: sizeStyles.fontSize,
              fontWeight: theme.typography.fontWeight.semibold,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Minimum touch target size
  },
  text: {
    textAlign: 'center',
  },
});
```

#### Step 3: Create Text Component

**File:** `src/components/ui/Text.tsx`

```typescript
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Text Component
 * 
 * Typography component with theme integration
 */

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align = 'left',
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.normal,
        };
      case 'h4':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
        };
      case 'body':
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.normal,
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        };
      case 'label':
        return {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.normal,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <RNText
      style={[
        styles.text,
        variantStyles,
        {
          color: color || theme.colors.text,
          textAlign: align,
          fontWeight: weight !== 'normal' ? theme.typography.fontWeight[weight] : variantStyles.fontWeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Base styles
  },
});
```

#### Step 4: Create Modal Component

**File:** `src/components/ui/Modal.tsx`

```typescript
import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from './Text';
import { Button } from './Button';

/**
 * Modal Component
 * 
 * Full-screen modal with overlay and animations
 */

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnOverlay = true,
}) => {
  const { theme } = useTheme();
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeOnOverlay ? onClose : undefined}
      >
        {/* Modal content */}
        <TouchableOpacity
          style={[
            styles.content,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              ...theme.shadows.lg,
            },
          ]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
              <Text variant="h3">{title}</Text>
            </View>
          )}
          
          {/* Body */}
          <View style={styles.body}>{children}</View>
          
          {/* Close button */}
          {showCloseButton && (
            <View style={styles.footer}>
              <Button
                title="Close"
                variant="secondary"
                onPress={onClose}
                fullWidth
              />
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: Math.min(width - 32, 500),
    maxHeight: '80%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  body: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
```

#### Step 5: Create Card Component

**File:** `src/components/ui/Card.tsx`

```typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Card Component
 * 
 * Container with elevation and padding
 */

export interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  style,
}) => {
  const { theme } = useTheme();
  
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };
  
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
          padding: getPadding(),
        },
        variant === 'elevated' && theme.shadows.md,
        variant === 'outlined' && {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        variant === 'filled' && {
          backgroundColor: theme.colors.surfaceLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
```

#### Step 6: Create Additional Components

**File:** `src/components/ui/Input.tsx` (TextInput wrapper)
**File:** `src/components/ui/Divider.tsx` (Horizontal/vertical line)
**File:** `src/components/ui/Spinner.tsx` (Loading indicator)

```typescript
// Input.tsx
export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceLight,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        {...props}
      />
      {error && (
        <Text variant="caption" color={theme.colors.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

// Divider.tsx
export const Divider: React.FC<{ orientation?: 'horizontal' | 'vertical' }> = ({
  orientation = 'horizontal',
}) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        { backgroundColor: theme.colors.border },
      ]}
    />
  );
};

// Spinner.tsx
export const Spinner: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'small' }) => {
  const { theme } = useTheme();
  
  return <ActivityIndicator size={size} color={theme.colors.primary} />;
};
```

#### Step 7: Create Component Index

**File:** `src/components/ui/index.ts`

```typescript
/**
 * UI Components Export
 * 
 * Centralized export for all UI components
 */

export * from './Button';
export * from './Text';
export * from './Modal';
export * from './Card';
export * from './Input';
export * from './Divider';
export * from './Spinner';
```

### Testing Steps

#### Test 1: Component Rendering

**File:** `src/components/ui/__tests__/Button.test.tsx`

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '@/theme/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading indicator when loading', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <Button title="Test Button" onPress={() => {}} loading />
    );
    
    expect(queryByText('Test Button')).toBeNull();
    // ActivityIndicator is shown instead
  });
  
  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPress} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });
  
  it('applies variant styles correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Primary" variant="primary" onPress={() => {}} />
    );
    
    const button = getByText('Primary').parent;
    expect(button?.props.style).toBeTruthy();
  });
});
```

#### Test 2: Theme Integration

```typescript
describe('Theme Integration', () => {
  it('uses theme colors', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test" variant="primary" onPress={() => {}} />
    );
    
    // Button should use primary color from theme
    // Test style includes theme.colors.primary
  });
});
```

#### Test 3: Visual Testing

Create Storybook stories for visual testing:

**File:** `src/components/ui/__stories__/Button.stories.tsx`

```typescript
import React from 'react';
import { Button } from '../Button';

export default {
  title: 'UI/Button',
  component: Button,
};

export const Primary = () => (
  <Button title="Primary Button" variant="primary" onPress={() => {}} />
);

export const Secondary = () => (
  <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
);

export const Ghost = () => (
  <Button title="Ghost Button" variant="ghost" onPress={() => {}} />
);

export const Loading = () => (
  <Button title="Loading" loading onPress={() => {}} />
);

export const Disabled = () => (
  <Button title="Disabled" disabled onPress={() => {}} />
);
```

### Definition of Done

- [ ] All basic UI components created
- [ ] Theme system implemented
- [ ] TypeScript types defined
- [ ] Accessibility labels added
- [ ] Components tested (85%+ coverage)
- [ ] Storybook stories created (optional)
- [ ] Documentation complete
- [ ] Dark mode working
- [ ] Performance verified (60 FPS)
- [ ] Code reviewed

### Common Issues & Solutions

**Issue 1:** "Components look different on iOS vs Android"
```typescript
// Solution: Use Platform-specific styles
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  button: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
```

**Issue 2:** "Touch targets too small on some devices"
```typescript
// Solution: Ensure minimum 44x44 touch target
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
  },
});
```

**Issue 3:** "Theme not updating on theme change"
```typescript
// Solution: Use useTheme hook, not direct import
const { theme } = useTheme(); // ✅ Reactive
// not: import { theme } from '@/theme/theme'; // ❌ Static
```

### Estimated Time

- **Theme system:** 2 hours
- **Button component:** 1.5 hours
- **Text component:** 1 hour
- **Modal component:** 1.5 hours
- **Card component:** 1 hour
- **Other components:** 2 hours
- **Testing:** 3 hours
- **Documentation:** 1 hour
- **Total:** ~13 hours

### Notes

- Theme system is critical - get it right first
- Button is most-used component - make it perfect
- Accessibility is not optional - add labels
- Test on both iOS and Android
- Consider animation performance
- Use React.memo for expensive components

### Related Documents

- Architecture Document: Section 7 (UI/UX Design)
- Story 4.2: Game UI uses these components

---

[Story 4.2 and 4.3 continue...]
## Story 4.2: Build Game UI Components

**Story ID:** 4.2  
**Story Points:** 5 SP  
**Priority:** High  
**Dependencies:** Story 4.1

### User Story

> **As a** player  
> **I want** game-specific UI elements  
> **So that** I can easily track my character status and make choices

### Implementation Summary

Build game-specific UI components that display game state and enable player interaction:
- **HealthBar** - Visual health indicator with animations
- **StatDisplay** - Character attributes and skills
- **ChoiceCard** - Interactive choice selection
- **ResourceBar** - Health, mana, gold display
- **QuestTracker** - Active quest display
- **DialogueBox** - NPC dialogue display
- **InventorySlot** - Item display in inventory

**Key Features:**
- Real-time state updates from Zustand stores
- Smooth animations (health decrease, level up)
- Conditional rendering (locked choices, failed skill checks)
- Touch feedback
- Accessibility support

#### HealthBar Component

**File:** `src/components/game/HealthBar.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '@components/ui';

export interface HealthBarProps {
  current: number;
  max: number;
  animated?: boolean;
  showText?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  animated = true,
  showText = true,
}) => {
  const { theme } = useTheme();
  const widthAnim = useRef(new Animated.Value(current / max)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: current / max,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [current, max]);
  
  const percentage = Math.round((current / max) * 100);
  const healthColor = percentage > 50
    ? theme.colors.success
    : percentage > 20
    ? theme.colors.warning
    : theme.colors.error;
  
  return (
    <View style={styles.container}>
      {showText && (
        <Text variant="caption" style={styles.label}>
          {current} / {max} HP
        </Text>
      )}
      <View style={[styles.barBackground, { backgroundColor: theme.colors.surfaceLight }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: healthColor,
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  barBackground: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});
```

#### ChoiceCard Component

**File:** `src/components/game/ChoiceCard.tsx`

```typescript
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text, Card } from '@components/ui';
import { Choice } from '@types/scenario';

export interface ChoiceCardProps {
  choice: Choice;
  onPress: () => void;
  disabled?: boolean;
  locked?: boolean;
  skillCheckDC?: number;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  onPress,
  disabled = false,
  locked = false,
  skillCheckDC,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || locked}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || locked }}
    >
      <Card
        variant="outlined"
        padding="md"
        style={[
          styles.card,
          locked && { opacity: 0.5, borderColor: theme.colors.textDisabled },
        ]}
      >
        <Text variant="body" weight="medium">
          {choice.textKey}
        </Text>
        
        {skillCheckDC && (
          <View style={styles.skillCheck}>
            <Text variant="caption" color={theme.colors.info}>
              Skill Check (DC {skillCheckDC})
            </Text>
          </View>
        )}
        
        {locked && (
          <View style={styles.lockedBadge}>
            <Text variant="caption" color={theme.colors.error}>
              🔒 Locked
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  skillCheck: {
    marginTop: 8,
  },
  lockedBadge: {
    marginTop: 8,
  },
});
```

#### StatDisplay Component

**File:** `src/components/game/StatDisplay.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '@components/ui';

export interface StatDisplayProps {
  label: string;
  value: number;
  maxValue?: number;
  variant?: 'compact' | 'detailed';
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  maxValue,
  variant = 'compact',
}) => {
  const { theme } = useTheme();
  
  if (variant === 'compact') {
    return (
      <View style={styles.compact}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {label}
        </Text>
        <Text variant="body" weight="semibold">
          {value}{maxValue && ` / ${maxValue}`}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.detailed}>
      <Text variant="body" color={theme.colors.textSecondary}>
        {label}
      </Text>
      <Text variant="h3" weight="bold" color={theme.colors.primary}>
        {value}
      </Text>
      {maxValue && (
        <Text variant="caption" color={theme.colors.textSecondary}>
          / {maxValue}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  compact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailed: {
    alignItems: 'center',
    padding: 16,
  },
});
```

**Additional Components:**
- ResourceBar (health + mana + gold in one row)
- QuestTracker (active quests sidebar)
- DialogueBox (NPC dialogue with portrait)
- InventorySlot (item icon with quantity badge)
- LevelUpBadge (animated celebration on level up)

**Testing:** 85%+ coverage, test with real game state
**Time:** ~11 hours

---

## Story 4.3: Create Screen Layouts

**Story ID:** 4.3  
**Story Points:** 3 SP  
**Priority:** High  
**Dependencies:** Stories 4.1, 4.2

### User Story

> **As a** developer  
> **I want** standardized screen layouts  
> **So that** all screens have consistent structure and spacing

### Implementation Summary

Create reusable screen layout components:
- **ScreenContainer** - Base container with safe area
- **ScrollableScreen** - Scrollable content with proper padding
- **GameScreen** - Layout for gameplay (narrative + choices)
- **MenuScreen** - Layout for menus (centered content)
- **SplitScreen** - Two-column layout (tablet support)

**Key Features:**
- Safe area handling (notches, home indicator)
- Keyboard avoidance for inputs
- Responsive to screen size
- ScrollView when content exceeds screen
- Loading states
- Error boundaries

#### ScreenContainer Component

**File:** `src/components/layouts/ScreenContainer.tsx`

```typescript
import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@/theme/theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  safeArea?: boolean;
  statusBarStyle?: 'light' | 'dark';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  safeArea = true,
  statusBarStyle = 'light',
}) => {
  const { theme } = useTheme();
  
  const Container = safeArea ? SafeAreaView : View;
  
  return (
    <Container style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

#### GameScreen Layout

**File:** `src/components/layouts/GameScreen.tsx`

```typescript
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { Text } from '@components/ui';
import { useTheme } from '@/theme/theme';

export interface GameScreenProps {
  title: string;
  narrative: string;
  children: React.ReactNode; // Choices
  footer?: React.ReactNode; // Resource bars
}

export const GameScreen: React.FC<GameScreenProps> = ({
  title,
  narrative,
  children,
  footer,
}) => {
  const { theme } = useTheme();
  
  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}
      >
        {/* Title */}
        <Text variant="h2" align="center" style={styles.title}>
          {title}
        </Text>
        
        {/* Narrative */}
        <Text variant="body" style={styles.narrative}>
          {narrative}
        </Text>
        
        {/* Choices */}
        <View style={styles.choices}>{children}</View>
      </ScrollView>
      
      {/* Footer (resources) */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  narrative: {
    marginBottom: 24,
  },
  choices: {
    marginBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    padding: 12,
  },
});
```

**Additional Layouts:**
- MenuScreen (centered content with header)
- InventoryScreen (grid layout)
- CharacterScreen (stats + equipment)
- MapScreen (scrollable map with pins)
- SettingsScreen (form layout)

**Testing:** 80%+ coverage
**Time:** ~5 hours

---

## Epic 4 Summary

**Completion Status:** 3/3 stories complete ✓  
**Total SP:** 13 SP  
**Estimated Duration:** 3-5 days (Sprint 3)

**Sprint 3 Goals:**
- ✅ UI component library complete
- ✅ Game UI components functional
- ✅ Screen layouts standardized
- ✅ Theme system working
- ✅ 85%+ test coverage
- ✅ Accessible components

**Key Deliverables:**
- 15+ reusable UI components
- Complete theme system
- Game-specific components
- Screen layouts
- Storybook documentation (optional)

**Integration Points:**
- Story 5.x (Game Screens) → Uses these components
- Epic 3 (Stores) → Components read from stores
- Epic 2 (Engine) → Components display game data

**Performance Targets:**
- 60 FPS animations
- < 16ms render time per component
- Smooth scrolling

**Next Epic:** Epic 5 - Game Screens (4 stories, 13 SP)

---

**END OF EPIC 4 USER STORIES**
