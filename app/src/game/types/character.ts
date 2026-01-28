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
  level: number;
  attributes: CharacterAttributeMap;
  skills: CharacterSkillMap;
  inventory: InventoryItem[];
  equipment: EquipmentSlots;
}
