import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainMenuOccam } from '../components/menu/MainMenuOccam';
import type { MenuOptionId } from '../constants/menuOptions';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { getGuardianShellTheme } from '../theme/guardianShell';
import { useUIStore } from '@/store/uiStore';
import { useSaveSlots } from '@/store/saveSlotsStore';
import { t } from '../localization/menu';

export const MainMenuScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { highContrast, locale } = useUIStore((state) => ({
    highContrast: state.highContrast,
    locale: state.locale,
  }));
  const theme = useMemo(() => getGuardianShellTheme(highContrast), [highContrast]);
  const hasSaves = useSaveSlots((state) => state.hasOccupied);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const isTestEnv = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
  const [overlayOpacity, setOverlayOpacity] = useState(isTestEnv ? 1 : 0);
  const overlayColor = highContrast ? 'rgba(4, 4, 4, 0.88)' : 'rgba(7, 9, 13, 0.82)';

  useEffect(() => {
    if (isTestEnv) {
      return;
    }
    const timeout = setTimeout(() => setOverlayOpacity(1), 180);
    return () => clearTimeout(timeout);
  }, [isTestEnv]);

  const handleNavigate = useCallback(
    (optionId: MenuOptionId) => {
      switch (optionId) {
        case 'newGame':
          navigation.navigate('CharacterCreation');
          break;
        case 'continue':
        case 'load':
          navigation.navigate('LoadGame');
          break;
        case 'settings':
          navigation.navigate('Settings');
          break;
        case 'credits':
          navigation.navigate('Credits');
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/splash-icon.png')}
        style={styles.background}
        blurRadius={bgmEnabled ? 0 : 6}
      >
        <View
          testID="main-menu-overlay"
          style={[styles.overlay, { backgroundColor: overlayColor, opacity: overlayOpacity }]}
        >
          <View style={styles.headerRow}>
            <Text
              style={[styles.versionLabel, { color: theme.palette.textSecondary }]}
              testID="main-menu-version"
            >
              v1.0.0
            </Text>
            <Pressable
              testID="bgm-toggle"
              accessibilityRole="button"
              accessibilityState={{ checked: bgmEnabled }}
              style={({ pressed }) => [
                styles.musicToggle,
                {
                  borderColor: theme.palette.outline,
                  backgroundColor: pressed ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                },
              ]}
              onPress={() => setBgmEnabled((prev) => !prev)}
            >
              <Text style={[styles.musicLabel, { color: theme.palette.textPrimary }]}>
                {bgmEnabled ? t(locale, 'music.on') : t(locale, 'music.off')}
              </Text>
            </Pressable>
          </View>
          <MainMenuOccam onNavigate={handleNavigate} />
          {!hasSaves && (
            <Text
              style={[styles.previewHint, { color: theme.palette.textSecondary }]}
              testID="save-preview-hint"
            >
              {t(locale, 'preview.emptyState')}
            </Text>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#02040a',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  versionLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  musicToggle: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  musicLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  previewHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    letterSpacing: 1,
  },
});
