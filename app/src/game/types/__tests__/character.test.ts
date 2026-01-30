import { createPlayerCharacter } from '../character';

describe('createPlayerCharacter helper', () => {
  it('provides sane defaults for new characters', () => {
    const hero = createPlayerCharacter();

    expect(hero.name).toBe('Unnamed Adventurer');
    expect(hero.level).toBe(1);
    expect(hero.attributes.strength).toBe(10);
    expect(hero.skills).toEqual({});
    expect(hero.inventory).toEqual([]);
    expect(hero.equipment).toEqual({});
  });

  it('merges overrides without mutating defaults', () => {
    const hero = createPlayerCharacter({
      name: 'Rada',
      level: 3,
      attributes: {
        strength: 10,
        agility: 10,
        intelligence: 10,
        charisma: 14,
        wisdom: 10,
        vitality: 10,
      },
      skills: { persuasion: 5 },
    });

    expect(hero.name).toBe('Rada');
    expect(hero.level).toBe(3);
    expect(hero.attributes.charisma).toBe(14);
    expect(hero.attributes.strength).toBe(10);
    expect(hero.skills).toEqual({ persuasion: 5 });
  });
});
