import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from './ScreenContainer';
import { useTheme } from '@/theme/theme';

/**
 * SplitScreen Component
 *
 * Two-column layout optimized for tablets and larger screens.
 * Automatically switches to single column on smaller screens.
 */

export interface SplitScreenProps {
  /** Content for the left/top panel */
  primary: React.ReactNode;
  /** Content for the right/bottom panel */
  secondary: React.ReactNode;
  /** Primary panel width percentage (0-1) */
  primaryRatio?: number;
  /** Whether primary panel should scroll independently */
  primaryScrollable?: boolean;
  /** Whether secondary panel should scroll independently */
  secondaryScrollable?: boolean;
  /** Minimum width to show split layout (switches to stack below this) */
  breakpoint?: number;
  /** Style for primary panel */
  primaryStyle?: ViewStyle;
  /** Style for secondary panel */
  secondaryStyle?: ViewStyle;
}

const { width: screenWidth } = Dimensions.get('window');

export const SplitScreen: React.FC<SplitScreenProps> = ({
  primary,
  secondary,
  primaryRatio = 0.6,
  primaryScrollable = true,
  secondaryScrollable = true,
  breakpoint = 768,
  primaryStyle,
  secondaryStyle,
}) => {
  const { theme } = useTheme();
  const isSplit = screenWidth >= breakpoint;

  const renderPrimary = () => (
    <View
      style={[
        styles.panel,
        isSplit && { flex: primaryRatio },
        { backgroundColor: theme.colors.background },
        primaryStyle,
      ]}
    >
      {primaryScrollable ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {primary}
        </ScrollView>
      ) : (
        primary
      )}
    </View>
  );

  const renderSecondary = () => (
    <View
      style={[
        styles.panel,
        isSplit && { flex: 1 - primaryRatio },
        {
          backgroundColor: theme.colors.surface,
          borderLeftColor: theme.colors.border,
        },
        isSplit && styles.secondaryPanel,
        secondaryStyle,
      ]}
    >
      {secondaryScrollable ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {secondary}
        </ScrollView>
      ) : (
        secondary
      )}
    </View>
  );

  return (
    <ScreenContainer safeArea={false}>
      <View
        style={[
          styles.container,
          !isSplit && styles.stackContainer,
        ]}
      >
        {renderPrimary()}
        {renderSecondary()}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  stackContainer: {
    flexDirection: 'column',
  },
  panel: {
    flex: 1,
  },
  secondaryPanel: {
    borderLeftWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
});
