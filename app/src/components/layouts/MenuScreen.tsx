import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * MenuScreen Component
 *
 * Centered layout for menu screens (main menu, settings, etc.).
 * Content is vertically and horizontally centered with optional header.
 */

export interface MenuScreenProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  children,
  title,
  subtitle,
  header,
  footer,
  contentStyle,
}) => {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      {/* Optional Custom Header */}
      {header}

      {/* Main Content - Centered */}
      <View style={styles.container}>
        <View
          style={[
            styles.content,
            { padding: theme.spacing.lg },
            contentStyle,
          ]}
        >
          {/* Title */}
          {title && (
            <Text
              variant="h1"
              align="center"
              style={styles.title}
              accessibilityLabel={`Меню: ${title}`}
            >
              {title}
            </Text>
          )}

          {/* Subtitle */}
          {subtitle && (
            <Text
              variant="body"
              color="textSecondary"
              align="center"
              style={styles.subtitle}
            >
              {subtitle}
            </Text>
          )}

          {/* Menu Items */}
          <View style={styles.menuContainer}>{children}</View>
        </View>
      </View>

      {/* Optional Footer */}
      {footer && (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {footer}
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  menuContainer: {
    width: '100%',
    gap: 12,
  },
  footer: {
    borderTopWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
});
