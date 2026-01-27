import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MENU_OPTIONS, type MenuOptionId, type MenuOptionMeta } from '../../constants/menuOptions';
import { useEntitlements } from '../../state/entitlements';
import { useUXState } from '../../state/uxState';
import { getGuardianShellTheme } from '../../theme/guardianShell';
import { t, type MenuCopyKey } from '../../localization/menu';
import {
  logMenuDlcLocked,
  logMenuOpened,
  logMenuOptionSelected,
} from '../../services/telemetry/menu';
import { useSaveSlots } from '../../state/saveSlots';
import { useUXPerfEvents } from '../../state/perf';

const BUTTON_LABEL_KEY: Record<MenuOptionId, MenuCopyKey> = {
  newGame: 'button.newGame',
  continue: 'button.continue',
  load: 'button.load',
  settings: 'button.settings',
  credits: 'button.credits',
  quit: 'button.quit',
  dlc: 'button.dlc',
};

const TOOLTIP_KEY: Record<MenuOptionId, MenuCopyKey> = {
  newGame: 'tooltips.newGame',
  continue: 'tooltips.continue',
  load: 'tooltips.load',
  settings: 'tooltips.settings',
  credits: 'tooltips.credits',
  quit: 'tooltips.quit',
  dlc: 'tooltips.dlcLocked',
};

const LOCKED_BADGE_KEY: MenuCopyKey = 'dlc.lockedLabel';
const UNLOCKED_BADGE_KEY: MenuCopyKey = 'dlc.unlockedLabel';

export const MainMenuOccam: React.FC = () => {
  const { locale, highContrast, setOverlaysVisible } = useUXState();
  const { hasEntitlement } = useEntitlements();
  const hasSaves = useSaveSlots((state) => state.hasOccupied);
  const logPerfEvent = useUXPerfEvents((state) => state.logEvent);
  const [activeOption, setActiveOption] = useState<MenuOptionId>('newGame');
  const renderStartRef = useRef<number | null>(
    typeof performance !== 'undefined' && performance.now ? performance.now() : null,
  );

  const theme = useMemo(() => getGuardianShellTheme(highContrast), [highContrast]);
  const tooltipText = useMemo(() => {
    if (!activeOption) return '';
    return t(locale, TOOLTIP_KEY[activeOption]);
  }, [activeOption, locale]);

  const dlcUnlocked = hasEntitlement('dlc-occult-expansion');

  useEffect(() => {
    logMenuOpened({ locale });
    setOverlaysVisible(1);
    return () => setOverlaysVisible(0);
  }, [locale, setOverlaysVisible]);

  useEffect(() => {
    setOverlaysVisible(activeOption ? 2 : 1);
  }, [activeOption, setOverlaysVisible]);

  useEffect(() => {
    if (!logPerfEvent) return;
    if (renderStartRef.current == null) return;
    const end = typeof performance !== 'undefined' && performance.now ? performance.now() : null;
    if (end == null) return;
    const duration = end - renderStartRef.current;
    logPerfEvent({
      id: 'main-menu-occam-render',
      durationMs: duration,
      timestamp: Date.now(),
    });
    renderStartRef.current = null;
  }, [logPerfEvent]);

  const handleOptionPress = (option: MenuOptionMeta, locked: boolean, disabled: boolean) => {
    setActiveOption(option.id);

    if (locked) {
      logMenuDlcLocked(option.id, { entitlement: option.requiresEntitlement });
      return;
    }

    if (disabled) {
      return;
    }

    logMenuOptionSelected(option.id, { variant: option.variant });
    // Actual navigation wiring will arrive with future stories.
  };

  return (
    <LinearGradient
      colors={[theme.palette.background, '#04050d']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container} testID="occam-root">
        <View
          style={[
            styles.storyTile,
            {
              backgroundColor: theme.palette.surface,
              borderColor: theme.palette.outline,
            },
          ]}
          testID="occam-layer-primary"
        >
          <Text style={[styles.titleLine1, { color: theme.palette.primary }]}>
            {t(locale, 'titleLine1')}
          </Text>
          <Text style={[styles.titleLine2, { color: theme.palette.primary }]}>
            {t(locale, 'titleLine2')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.palette.textSecondary }]}>
            {t(locale, 'subtitle')}
          </Text>

          <View style={styles.menuList}>
            {MENU_OPTIONS.map((option) => {
              const locked = Boolean(option.requiresEntitlement && !dlcUnlocked);
              const disabled =
                locked ||
                ((option.id === 'continue' || option.id === 'load') && !hasSaves);
              return (
                <Pressable
                  key={option.id}
                  testID={`menu-option-${option.id}`}
                  style={({ pressed }) => [
                    styles.menuButton,
                    {
                      borderColor: theme.palette.outline,
                      backgroundColor: pressed
                        ? theme.palette.panel
                        : 'rgba(255, 255, 255, 0.02)',
                      opacity: disabled ? 0.5 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled }}
                  onPressIn={() => setActiveOption(option.id)}
                  onPress={() => handleOptionPress(option, locked, disabled)}
                >
                  <Text style={[styles.buttonLabel, { color: theme.palette.textPrimary }]}>
                    {t(locale, BUTTON_LABEL_KEY[option.id])}
                  </Text>
                  {option.id === 'dlc' && (
                    <Text
                      style={[
                        styles.dlcBadge,
                        { color: theme.palette.accent, borderColor: theme.palette.accent },
                      ]}
                    >
                      {t(locale, locked ? LOCKED_BADGE_KEY : UNLOCKED_BADGE_KEY)}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.overlayPanel,
            {
              backgroundColor: theme.palette.panel,
              borderColor: theme.palette.outline,
            },
          ]}
          testID="occam-layer-overlay"
        >
          <Text style={[styles.overlayHeading, { color: theme.palette.secondary }]}>
            Witness Voice
          </Text>
          <Text style={[styles.overlayBody, { color: theme.palette.textPrimary }]}>
            {tooltipText}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 24,
    gap: 24,
  },
  storyTile: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  titleLine1: {
    fontSize: 32,
    fontWeight: '700',
  },
  titleLine2: {
    fontSize: 28,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  menuList: {
    gap: 12,
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  dlcBadge: {
    fontSize: 12,
    marginTop: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 999,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  overlayPanel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'flex-start',
    gap: 12,
  },
  overlayHeading: {
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  overlayBody: {
    fontSize: 16,
    lineHeight: 22,
  },
});
