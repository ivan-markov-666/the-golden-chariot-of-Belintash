import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { EdgeInsets, SafeAreaProvider } from 'react-native-safe-area-context';

const ZERO_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: ZERO_INSETS,
};

export const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions) =>
  render(
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>{ui}</SafeAreaProvider>,
    options,
  );
