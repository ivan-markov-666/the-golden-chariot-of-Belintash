export interface CharacterAttributeMap {
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  wisdom: number;
  vitality: number;
  [key: string]: number;
}

export interface CharacterSkillMap {
  [skill: string]: number;
}

export interface InventoryItem {
  id: string;
  quantity?: number;
  equipped?: boolean;
}

export interface EquipmentSlots {
  head?: InventoryItem;
  body?: InventoryItem;
  hands?: InventoryItem;
  legs?: InventoryItem;
  feet?: InventoryItem;
  weapon?: InventoryItem;
  offhand?: InventoryItem;
  accessory?: InventoryItem;
  [slot: string]: InventoryItem | undefined;
}

export interface PlayerCharacter {
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  gold: number;
  attributes: CharacterAttributeMap;
  skills: CharacterSkillMap;
  inventory: InventoryItem[];
  equipment: EquipmentSlots;
}

const DEFAULT_ATTRIBUTES: CharacterAttributeMap = {
  strength: 10,
  agility: 10,
  intelligence: 10,
  charisma: 10,
  wisdom: 10,
  vitality: 10,
};

export const createPlayerCharacter = (
  overrides: Partial<PlayerCharacter> = {},
): PlayerCharacter => {
  const base: PlayerCharacter = {
    name: 'Unnamed Adventurer',
    level: 1,
    experience: 0,
    health: 10,
    maxHealth: 10,
    mana: 5,
    maxMana: 5,
    gold: 0,
    attributes: { ...DEFAULT_ATTRIBUTES },
    skills: {},
    inventory: [],
    equipment: {},
  };

  return {
    ...base,
    ...overrides,
    attributes: { ...DEFAULT_ATTRIBUTES, ...(overrides.attributes ?? {}) },
    skills: { ...(overrides.skills ?? {}) },
    inventory: overrides.inventory ?? base.inventory,
    equipment: overrides.equipment ?? base.equipment,
  };
};
