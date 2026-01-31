import { CharacterProgressionService } from '@/services/CharacterProgressionService';
import { createPlayerCharacter } from '@/game/types/character';

describe('CharacterProgressionService', () => {
  it('връща фиксирани level-up награди', () => {
    const character = createPlayerCharacter({ level: 5 });
    const rewards = CharacterProgressionService.getLevelUpRewards(character);
    expect(rewards).toEqual({ attributePoints: 2, skillPoints: 3 });
  });

  it('изчислява inventory weight с quantity/weight по подразбиране', () => {
    const weight = CharacterProgressionService.calculateInventoryWeight([
      { id: 'herb', quantity: 3, weight: 0.5 },
      { id: 'gem', quantity: 2 },
    ]);
    expect(weight).toBeCloseTo(3 * 0.5 + 2 * 1);
  });

  it('знае кога персонажът е encumbered', () => {
    expect(CharacterProgressionService.isEncumbered(81, 80)).toBe(true);
    expect(CharacterProgressionService.isEncumbered(40, 80)).toBe(false);
  });

  it('валидира изисквания за equip по level и attributes', () => {
    const character = createPlayerCharacter({
      level: 4,
      attributes: { strength: 10, agility: 8, intelligence: 7, charisma: 5, wisdom: 5, vitality: 9 },
    });

    const axe = {
      id: 'axe',
      requirements: { level: 5 },
    };
    expect(CharacterProgressionService.canEquip(character, axe)).toBe(false);

    const dagger = {
      id: 'dagger',
      requirements: { attributes: { agility: 12 } },
    };
    expect(CharacterProgressionService.canEquip(character, dagger)).toBe(false);

    const ring = {
      id: 'ring',
      requirements: { level: 4, attributes: { strength: 9 } },
    };
    expect(CharacterProgressionService.canEquip(character, ring)).toBe(true);
  });

  it('прилага modifiers от equipment и status effects върху attributes/skills', () => {
    const sword = {
      id: 'sword',
      attributeModifiers: { strength: 3 },
      skillModifiers: { swords: 2 },
    };

    const effect = {
      id: 'blessing',
      type: 'buff',
      appliedAt: Date.now(),
      attributeModifiers: { strength: 1 },
      skillModifiers: { swords: 1 },
    };

    const character = createPlayerCharacter({
      attributes: { strength: 12, agility: 8, intelligence: 7, charisma: 5, wisdom: 6, vitality: 9 },
      skills: { swords: 5 },
      equipment: { weapon: sword },
      statusEffects: [effect],
    });

    const attributes = CharacterProgressionService.calculateEffectiveAttributes(character);
    const skills = CharacterProgressionService.calculateEffectiveSkills(character);

    expect(attributes.strength).toBe(12 + 3 + 1);
    expect(skills.swords).toBe(5 + 2 + 1);
  });

  it('почиства изтекли статус ефекти', () => {
    const now = Date.now();
    const effects = [
      { id: 'permanent', type: 'buff', appliedAt: now - 10000 },
      { id: 'short', type: 'buff', appliedAt: now - 5000, durationMs: 1000 },
      { id: 'long', type: 'buff', appliedAt: now - 500, durationMs: 2000 },
    ];

    const filtered = CharacterProgressionService.pruneExpiredEffects(effects, now);
    expect(filtered.map((e) => e.id)).toEqual(['permanent', 'long']);
  });
});
