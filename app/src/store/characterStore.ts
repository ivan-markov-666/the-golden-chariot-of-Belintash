import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { PlayerCharacter, createPlayerCharacter } from '@/game/types/character';

export interface CharacterStoreState {
  character: PlayerCharacter | null;
  createCharacter: (overrides?: Partial<PlayerCharacter>) => void;
  updateCharacter: (updates: Partial<PlayerCharacter>) => void;
  addExperience: (amount: number) => void;
  levelUp: () => void;
  adjustHealth: (amount: number) => void;
  adjustMana: (amount: number) => void;
  adjustGold: (amount: number) => void;
  increaseAttribute: (attribute: keyof PlayerCharacter['attributes'], amount: number) => void;
  increaseSkill: (skill: keyof PlayerCharacter['skills'], amount: number) => void;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (slot: keyof PlayerCharacter['equipment'], itemId: string) => void;
  unequipItem: (slot: keyof PlayerCharacter['equipment']) => void;
  resetCharacter: () => void;
  loadCharacter: (character: PlayerCharacter) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const useCharacterStore = create<CharacterStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        character: null,
        createCharacter: (overrides = {}) =>
          set(
            () => ({ character: createPlayerCharacter(overrides) }),
            false,
            'character/create',
          ),
        updateCharacter: (updates) =>
          set(
            (state) => ({
              character: state.character ? { ...state.character, ...updates } : state.character,
            }),
            false,
            'character/update',
          ),
        addExperience: (amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              const experience = state.character.experience + amount;
              return {
                character: {
                  ...state.character,
                  experience,
                },
              };
            },
            false,
            'character/addExperience',
          ),
        levelUp: () =>
          set(
            (state) => {
              if (!state.character) return state;
              const canLevelUp = state.character.experience >= state.character.level * 100;
              if (!canLevelUp) return state;
              const newLevel = state.character.level + 1;
              return {
                character: {
                  ...state.character,
                  level: newLevel,
                  experience: state.character.experience - state.character.level * 100,
                  maxHealth: state.character.maxHealth + 5,
                  health: state.character.maxHealth + 5,
                  maxMana: state.character.maxMana + 3,
                  mana: state.character.maxMana + 3,
                },
              };
            },
            false,
            'character/levelUp',
          ),
        adjustHealth: (amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  health: clamp(state.character.health + amount, 0, state.character.maxHealth),
                },
              };
            },
            false,
            'character/adjustHealth',
          ),
        adjustMana: (amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  mana: clamp(state.character.mana + amount, 0, state.character.maxMana),
                },
              };
            },
            false,
            'character/adjustMana',
          ),
        adjustGold: (amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  gold: Math.max(0, state.character.gold + amount),
                },
              };
            },
            false,
            'character/adjustGold',
          ),
        increaseAttribute: (attribute, amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  attributes: {
                    ...state.character.attributes,
                    [attribute]: clamp(state.character.attributes[attribute] + amount, 0, 100),
                  },
                },
              };
            },
            false,
            `character/increaseAttribute/${String(attribute)}`,
          ),
        increaseSkill: (skill, amount) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  skills: {
                    ...state.character.skills,
                    [skill]: clamp((state.character.skills[skill] ?? 0) + amount, 0, 100),
                  },
                },
              };
            },
            false,
            `character/increaseSkill/${String(skill)}`,
          ),
        addItem: (itemId, quantity = 1) =>
          set(
            (state) => {
              if (!state.character) return state;
              const existing = state.character.inventory.find((item) => item.id === itemId);
              if (existing) {
                return {
                  character: {
                    ...state.character,
                    inventory: state.character.inventory.map((item) =>
                      item.id === itemId ? { ...item, quantity: (item.quantity ?? 1) + quantity } : item,
                    ),
                  },
                };
              }
              return {
                character: {
                  ...state.character,
                  inventory: [...state.character.inventory, { id: itemId, quantity }],
                },
              };
            },
            false,
            'character/addItem',
          ),
        removeItem: (itemId, quantity = 1) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  inventory: state.character.inventory
                    .map((item) =>
                      item.id === itemId
                        ? { ...item, quantity: Math.max(0, (item.quantity ?? 1) - quantity) }
                        : item,
                    )
                    .filter((item) => (item.quantity ?? 0) > 0),
                },
              };
            },
            false,
            'character/removeItem',
          ),
        equipItem: (slot, itemId) =>
          set(
            (state) => {
              if (!state.character) return state;
              return {
                character: {
                  ...state.character,
                  equipment: {
                    ...state.character.equipment,
                    [slot]: { id: itemId },
                  },
                },
              };
            },
            false,
            `character/equip/${String(slot)}`,
          ),
        unequipItem: (slot) =>
          set(
            (state) => {
              if (!state.character) return state;
              const { [slot]: removed, ...rest } = state.character.equipment;
              return {
                character: {
                  ...state.character,
                  equipment: { ...rest },
                },
              };
            },
            false,
            `character/unequip/${String(slot)}`,
          ),
        resetCharacter: () => set({ character: null }, false, 'character/reset'),
        loadCharacter: (character) => set({ character }, false, 'character/load'),
      }),
      {
        name: 'character-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ character: state.character }),
      },
    ),
    { name: 'CharacterStore' },
  ),
);

export const selectCharacter = (state: CharacterStoreState) => state.character;
export const selectHealth = (state: CharacterStoreState) =>
  state.character ? { current: state.character.health, max: state.character.maxHealth } : null;
export const selectMana = (state: CharacterStoreState) =>
  state.character ? { current: state.character.mana, max: state.character.maxMana } : null;
export const selectAttribute = (attribute: keyof PlayerCharacter['attributes']) =>
  (state: CharacterStoreState) => state.character?.attributes[attribute] ?? 0;
export const selectSkill = (skill: keyof PlayerCharacter['skills']) =>
  (state: CharacterStoreState) => state.character?.skills[skill] ?? 0;
