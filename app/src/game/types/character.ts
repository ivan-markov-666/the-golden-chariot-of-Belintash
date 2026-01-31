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
  weight?: number;
  attributeModifiers?: Partial<CharacterAttributeMap>;
  skillModifiers?: Partial<CharacterSkillMap>;
  requirements?: {
    level?: number;
    attributes?: Partial<CharacterAttributeMap>;
  };
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

export interface StatusEffect {
  id: string;
  type: 'buff' | 'debuff' | 'condition';
  source?: string;
  magnitude?: number;
  durationMs?: number;
  appliedAt: number;
  attributeModifiers?: Partial<CharacterAttributeMap>;
  skillModifiers?: Partial<CharacterSkillMap>;
}

export type CharacterMilestone = {
  id: string;
  unlockedAt: number;
  description?: string;
};

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
  attributePoints: number;
  skillPoints: number;
  statusEffects: StatusEffect[];
  milestones: CharacterMilestone[];
  inventoryWeight: number;
  maxCarryWeight: number;
  encumbered: boolean;
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
    attributePoints: 0,
    skillPoints: 0,
    statusEffects: [],
    milestones: [],
    inventoryWeight: 0,
    maxCarryWeight: 80,
    encumbered: false,
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
