import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { useTheme } from '@/theme/theme';

/**
 * ScrollableScreen Component
 *
 * Scrollable content with keyboard avoidance and proper padding.
 * Automatically handles keyboard appearance on iOS.
 */

export interface ScrollableScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  avoidKeyboard?: boolean;
  contentContainerStyle?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ScrollableScreen: React.FC<ScrollableScreenProps> = ({
  children,
  avoidKeyboard = true,
  contentContainerStyle,
  padding = 'md',
  ...scrollViewProps
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

  const content = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { padding: getPadding() },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );

  if (avoidKeyboard && Platform.OS === 'ios') {
    return (
      <ScreenContainer>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          {content}
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return <ScreenContainer>{content}</ScreenContainer>;
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
