/* istanbul ignore file */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { MainMenuScreen } from '../screens/MainMenuScreen';
import { LoadGameScreen } from '../screens/LoadGameScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

enableScreens(true);

export type RootStackParamList = {
  MainMenu: undefined;
  LoadGame: undefined;
  CharacterCreation: undefined;
  Gameplay: { scenarioId?: string } | undefined;
  Inventory: undefined;
  Settings: undefined;
  Credits: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const CharacterCreationPlaceholder = () => (
  <PlaceholderScreen
    title="Character Creation"
    description="Occam character builder will arrive with Story 1.5."
  />
);

const GameplayPlaceholder = () => (
  <PlaceholderScreen
    title="Gameplay"
    description="Core scenario runner wires in after GuardianShell AOI."
  />
);

const InventoryPlaceholder = () => (
  <PlaceholderScreen
    title="Inventory"
    description="GuardianShell gear/equipment management is pending implementation."
  />
);

const SettingsPlaceholder = () => (
  <PlaceholderScreen
    title="Settings"
    description="Audio, localization, and accessibility controls will land in Story 1.6."
  />
);

const CreditsPlaceholder = () => (
  <PlaceholderScreen
    title="Credits"
    description="Lorebook credits and contributors listing is coming soon."
  />
);

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#02040a' },
        }}
        initialRouteName="MainMenu"
      >
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen
          name="LoadGame"
          component={LoadGameScreen}
          options={{
            headerShown: true,
            title: 'Load Game',
            headerStyle: { backgroundColor: '#02040a' },
            headerTintColor: '#f8fafc',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        <Stack.Screen
          name="CharacterCreation"
          component={CharacterCreationPlaceholder}
          options={{ headerShown: true, title: 'Character Creation' }}
        />
        <Stack.Screen
          name="Gameplay"
          component={GameplayPlaceholder}
          options={{ headerShown: true, title: 'Gameplay' }}
        />
        <Stack.Screen
          name="Inventory"
          component={InventoryPlaceholder}
          options={{ headerShown: true, title: 'Inventory' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsPlaceholder}
          options={{ headerShown: true, title: 'Settings' }}
        />
        <Stack.Screen
          name="Credits"
          component={CreditsPlaceholder}
          options={{ headerShown: true, title: 'Credits' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
