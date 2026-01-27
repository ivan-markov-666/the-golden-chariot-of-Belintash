import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainMenuOccam } from '../components/menu/MainMenuOccam';
import type { MenuOptionId } from '../constants/menuOptions';
import type { RootStackParamList } from '../navigation/AppNavigator';

export const MainMenuScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      <MainMenuOccam onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#02040a',
  },
});
