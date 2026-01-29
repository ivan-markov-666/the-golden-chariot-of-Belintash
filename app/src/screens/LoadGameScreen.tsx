import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SaveSlotOccam } from '../components/save/SaveSlotOccam';

export const LoadGameScreen: React.FC = () => (
  <SafeAreaView style={styles.safeArea}>
    <SaveSlotOccam />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#02040a',
  },
});
