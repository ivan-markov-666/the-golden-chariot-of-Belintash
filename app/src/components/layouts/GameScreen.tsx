import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * GameScreen Component
 *
 * Layout for gameplay screens with narrative text and choices.
 * Includes scrollable content area and optional footer for resource bars.
 */

export interface GameScreenProps {
  title?: string;
  narrative?: string;
  children: React.ReactNode; // Choices or interactive elements
  footer?: React.ReactNode; // Resource bars, stats, etc.
  header?: React.ReactNode; // Custom header content
  contentStyle?: ViewStyle;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  title,
  narrative,
  children,
  footer,
  header,
  contentStyle,
}) => {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      {/* Optional Custom Header */}
      {header}

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { padding: theme.spacing.md },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        {title && (
          <Text
            variant="h2"
            align="center"
            style={styles.title}
            accessibilityLabel={`Заглавие: ${title}`}
          >
            {title}
          </Text>
        )}

        {/* Narrative Text */}
        {narrative && (
          <Text
            variant="body"
            style={styles.narrative}
            accessibilityLabel="Разказ"
          >
            {narrative}
          </Text>
        )}

        {/* Interactive Content (Choices) */}
        <View style={styles.choicesContainer}>{children}</View>
      </ScrollView>

      {/* Footer (Resource Bars, etc.) */}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  narrative: {
    marginBottom: 24,
    lineHeight: 24,
  },
  choicesContainer: {
    marginBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    padding: 12,
  },
});
