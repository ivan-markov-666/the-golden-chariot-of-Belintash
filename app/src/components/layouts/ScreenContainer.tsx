import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * ScreenContainer Component
 *
 * Base container with safe area handling for notches and home indicators.
 * Automatically applies theme background color and status bar styling.
 */

export interface ScreenContainerProps {
  children: React.ReactNode;
  safeArea?: boolean;
  statusBarStyle?: 'light' | 'dark';
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  safeArea = true,
  statusBarStyle = 'light',
  style,
}) => {
  const { theme } = useTheme();

  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
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
