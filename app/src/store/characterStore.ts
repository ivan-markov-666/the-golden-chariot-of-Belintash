import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { withStoreLogger } from './middleware/withStoreLogger';
import { PlayerCharacter, StatusEffect, createPlayerCharacter } from '@/game/types/character';
import { CharacterProgressionService } from '@/services/CharacterProgressionService';

export interface CharacterStoreState {
  character: PlayerCharacter | null;
  createCharacter: (overrides?: Partial<PlayerCharacter>) => void;
  updateCharacter: (updates: Partial<PlayerCharacter>) => void;
  addExperience: (amount: number) => void;
  levelUp: () => void;
  spendAttributePoint: (attribute: keyof PlayerCharacter['attributes']) => void;
  spendSkillPoint: (skill: keyof PlayerCharacter['skills']) => void;
  adjustHealth: (amount: number) => void;
  adjustMana: (amount: number) => void;
  adjustGold: (amount: number) => void;
  increaseAttribute: (attribute: keyof PlayerCharacter['attributes'], amount: number) => void;
  increaseSkill: (skill: keyof PlayerCharacter['skills'], amount: number) => void;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (slot: keyof PlayerCharacter['equipment'], itemId: string) => void;
  unequipItem: (slot: keyof PlayerCharacter['equipment']) => void;
  applyStatusEffect: (effect: StatusEffect) => void;
  removeStatusEffect: (effectId: string) => void;
  unlockMilestone: (id: string, description?: string) => void;
  resetCharacter: () => void;
  loadCharacter: (character: PlayerCharacter) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const recalcInventory = (character: PlayerCharacter) => {
  const inventoryWeight = CharacterProgressionService.calculateInventoryWeight(character.inventory);
  const encumbered = CharacterProgressionService.isEncumbered(
    inventoryWeight,
    character.maxCarryWeight,
  );
  return {
    inventoryWeight,
    encumbered,
  };
};

export const useCharacterStore = create<CharacterStoreState>()(
  withStoreLogger(
    devtools(
      persist(
        (set, get) => ({
          character: null,
          createCharacter: (overrides = {}) =>
            set(
              () => {
                const character = createPlayerCharacter(overrides);
                const { inventoryWeight, encumbered } = recalcInventory(character);
                return { character: { ...character, inventoryWeight, encumbered } };
              },
              false,
              'character/create',
            ),
          updateCharacter: (updates) =>
            set(
              (state) => {
                if (!state.character) return state;
                const next = { ...state.character, ...updates };
                const derived = recalcInventory(next);
                return { character: { ...next, ...derived } };
              },
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
                const rewards = CharacterProgressionService.getLevelUpRewards(state.character);
                return {
                  character: {
                    ...state.character,
                    level: newLevel,
                    experience: state.character.experience - state.character.level * 100,
                    maxHealth: state.character.maxHealth + 5,
                    health: state.character.maxHealth + 5,
                    maxMana: state.character.maxMana + 3,
                    mana: state.character.maxMana + 3,
                    attributePoints: state.character.attributePoints + rewards.attributePoints,
                    skillPoints: state.character.skillPoints + rewards.skillPoints,
                  },
                };
              },
              false,
              'character/levelUp',
            ),
          spendAttributePoint: (attribute) =>
            set(
              (state) => {
                if (!state.character || state.character.attributePoints <= 0) return state;
                return {
                  character: {
                    ...state.character,
                    attributePoints: state.character.attributePoints - 1,
                    attributes: {
                      ...state.character.attributes,
                      [attribute]: clamp(state.character.attributes[attribute] + 1, 0, 100),
                    },
                  },
                };
              },
              false,
              `character/spendAttributePoint/${String(attribute)}`,
            ),
          spendSkillPoint: (skill) =>
            set(
              (state) => {
                if (!state.character || state.character.skillPoints <= 0) return state;
                return {
                  character: {
                    ...state.character,
                    skillPoints: state.character.skillPoints - 1,
                    skills: {
                      ...state.character.skills,
                      [skill]: clamp((state.character.skills[skill] ?? 0) + 1, 0, 100),
                    },
                  },
                };
              },
              false,
              `character/spendSkillPoint/${String(skill)}`,
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
                  const inventory = state.character.inventory.map((item) =>
                    item.id === itemId ? { ...item, quantity: (item.quantity ?? 1) + quantity } : item,
                  );
                  const updatedCharacter = { ...state.character, inventory };
                  const { inventoryWeight, encumbered } = recalcInventory(updatedCharacter);
                  return {
                    character: { ...updatedCharacter, inventoryWeight, encumbered },
                  };
                }
                const updatedCharacter = {
                  ...state.character,
                  inventory: [...state.character.inventory, { id: itemId, quantity }],
                };
                const { inventoryWeight, encumbered } = recalcInventory(updatedCharacter);
                return {
                  character: { ...updatedCharacter, inventoryWeight, encumbered },
                };
              },
              false,
              'character/addItem',
            ),
          removeItem: (itemId, quantity = 1) =>
            set(
              (state) => {
                if (!state.character) return state;
                const inventory = state.character.inventory
                  .map((item) =>
                    item.id === itemId
                      ? { ...item, quantity: Math.max(0, (item.quantity ?? 1) - quantity) }
                      : item,
                  )
                  .filter((item) => (item.quantity ?? 0) > 0);
                const updatedCharacter = { ...state.character, inventory };
                const { inventoryWeight, encumbered } = recalcInventory(updatedCharacter);
                return {
                  character: { ...updatedCharacter, inventoryWeight, encumbered },
                };
              },
              false,
              'character/removeItem',
            ),
          equipItem: (slot, itemId) =>
            set(
              (state) => {
                if (!state.character) return state;
                const item = state.character.inventory.find((entry) => entry.id === itemId);
                if (!CharacterProgressionService.canEquip(state.character, item)) {
                  return state;
                }
                return {
                  character: {
                    ...state.character,
                    equipment: {
                      ...state.character.equipment,
                      [slot]: item ? { ...item, equipped: true } : { id: itemId },
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
          applyStatusEffect: (effect) =>
            set(
              (state) => {
                if (!state.character) return state;
                const filtered = CharacterProgressionService.pruneExpiredEffects(
                  state.character.statusEffects,
                  Date.now(),
                );
                return {
                  character: {
                    ...state.character,
                    statusEffects: [...filtered, effect],
                  },
                };
              },
              false,
              `character/statusEffect/apply/${effect.id}`,
            ),
          removeStatusEffect: (effectId) =>
            set(
              (state) => {
                if (!state.character) return state;
                return {
                  character: {
                    ...state.character,
                    statusEffects: state.character.statusEffects.filter((effect) => effect.id !== effectId),
                  },
                };
              },
              false,
              `character/statusEffect/remove/${effectId}`,
            ),
          unlockMilestone: (id, description) =>
            set(
              (state) => {
                if (!state.character) return state;
                if (state.character.milestones.some((m) => m.id === id)) {
                  return state;
                }
                return {
                  character: {
                    ...state.character,
                    milestones: [...state.character.milestones, { id, unlockedAt: Date.now(), description }],
                  },
                };
              },
              false,
              `character/milestone/${id}`,
            ),
          resetCharacter: () => set({ character: null }, false, 'character/reset'),
          loadCharacter: (character) =>
            set(
              () => {
                const derived = recalcInventory(character);
                return { character: { ...character, ...derived } };
              },
              false,
              'character/load',
            ),
        }),
        {
          name: 'character-storage',
          storage: createJSONStorage(() => AsyncStorage),
          partialize: (state) => ({ character: state.character }),
        },
      ),
      { name: 'CharacterStore' },
    ),
    'CharacterStore',
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
export const selectPendingAttributePoints = (state: CharacterStoreState) =>
  state.character?.attributePoints ?? 0;
export const selectPendingSkillPoints = (state: CharacterStoreState) =>
  state.character?.skillPoints ?? 0;
export const selectInventoryStatus = (state: CharacterStoreState) =>
  state.character
    ? {
        weight: state.character.inventoryWeight,
        maxCarry: state.character.maxCarryWeight,
        encumbered: state.character.encumbered,
      }
    : null;
export const selectStatusEffects = (state: CharacterStoreState) => state.character?.statusEffects ?? [];
export const selectMilestones = (state: CharacterStoreState) => state.character?.milestones ?? [];
export const selectEffectiveAttributes = (state: CharacterStoreState) =>
  state.character ? CharacterProgressionService.calculateEffectiveAttributes(state.character) : null;
export const selectEffectiveSkills = (state: CharacterStoreState) =>
  state.character ? CharacterProgressionService.calculateEffectiveSkills(state.character) : null;
