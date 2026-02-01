/**
 * Navigation Types
 * 
 * Type definitions for React Navigation stack navigator
 */

export type RootStackParamList = {
  MainMenu: undefined;
  CharacterCreation: undefined;
  Gameplay: { scenarioId?: string };
  Inventory: undefined;
  LoadGame: undefined;
  Settings: undefined;
};
