import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, description }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02040a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#cbd5f5',
    textAlign: 'center',
    lineHeight: 22,
  },
});
