import { CharacterAttributeMap, CharacterSkillMap, InventoryItem, PlayerCharacter, StatusEffect } from '@/game/types/character';

const ATTRIBUTE_POINTS_PER_LEVEL = 2;
const SKILL_POINTS_PER_LEVEL = 3;
const DEFAULT_ITEM_WEIGHT = 1;

export type LevelUpRewards = {
  attributePoints: number;
  skillPoints: number;
};

export class CharacterProgressionService {
  public static getLevelUpRewards(_character: PlayerCharacter): LevelUpRewards {
    return {
      attributePoints: ATTRIBUTE_POINTS_PER_LEVEL,
      skillPoints: SKILL_POINTS_PER_LEVEL,
    };
  }

  public static calculateInventoryWeight(inventory: InventoryItem[]): number {
    return inventory.reduce((total, item) => {
      const qty = item.quantity ?? 1;
      const weight = item.weight ?? DEFAULT_ITEM_WEIGHT;
      return total + qty * weight;
    }, 0);
  }

  public static isEncumbered(weight: number, maxCarry: number): boolean {
    return weight > maxCarry;
  }

  public static canEquip(character: PlayerCharacter, item: InventoryItem | undefined): boolean {
    if (!item) return false;
    const { requirements } = item;
    if (!requirements) return true;

    if (requirements.level && character.level < requirements.level) {
      return false;
    }

    if (requirements.attributes) {
      const attrReqs = requirements.attributes;
      const unmet = Object.entries(attrReqs).some(([key, value]) => {
        const current = character.attributes[key as keyof CharacterAttributeMap] ?? 0;
        return current < (value ?? 0);
      });
      if (unmet) {
        return false;
      }
    }

    return true;
  }

  public static calculateEffectiveAttributes(character: PlayerCharacter): CharacterAttributeMap {
    const base: CharacterAttributeMap = { ...character.attributes };

    const applyModifiers = (modifiers?: Partial<CharacterAttributeMap>) => {
      if (!modifiers) return;
      Object.entries(modifiers).forEach(([key, value]) => {
        const attribute = key as keyof CharacterAttributeMap;
        base[attribute] = base[attribute] + (value ?? 0);
      });
    };

    Object.values(character.equipment).forEach((item) => {
      if (item) {
        applyModifiers(item.attributeModifiers);
      }
    });

    character.statusEffects.forEach((effect) => {
      applyModifiers(effect.attributeModifiers);
    });

    return base;
  }

  public static calculateEffectiveSkills(character: PlayerCharacter): CharacterSkillMap {
    const base: CharacterSkillMap = { ...character.skills };

    const applyModifiers = (modifiers?: Partial<CharacterSkillMap>) => {
      if (!modifiers) return;
      Object.entries(modifiers).forEach(([key, value]) => {
        const skill = key as keyof CharacterSkillMap;
        base[skill] = (base[skill] ?? 0) + (value ?? 0);
      });
    };

    Object.values(character.equipment).forEach((item) => {
      if (item) {
        applyModifiers(item.skillModifiers);
      }
    });

    character.statusEffects.forEach((effect) => {
      applyModifiers(effect.skillModifiers);
    });

    return base;
  }

  public static pruneExpiredEffects(effects: StatusEffect[], currentTime: number): StatusEffect[] {
    return effects.filter((effect) => {
      if (!effect.durationMs) return true;
      return effect.appliedAt + effect.durationMs > currentTime;
    });
  }
}
