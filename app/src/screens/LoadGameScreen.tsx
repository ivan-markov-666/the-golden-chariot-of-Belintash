import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
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
