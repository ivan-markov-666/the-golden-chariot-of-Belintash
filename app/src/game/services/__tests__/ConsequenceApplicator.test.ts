import { ConsequenceApplicator } from '../ConsequenceApplicator';
import { GameState } from '../../types/gameState';
import { PlayerCharacter } from '../../types/character';
import { Consequence } from '../../types/consequence';

describe('ConsequenceApplicator', () => {
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    debugSpy.mockRestore();
  });

  it('applies heterogeneous consequences atomically and emits events', async () => {
    const gameState = createGameState();
    const character = createCharacter();

    const consequences: Consequence[] = [
      { type: 'flag', target: 'quest.started', value: true },
      { type: 'counter', target: 'kills', action: 'increment', value: 2 },
      { type: 'stat', target: 'strength', action: 'increase', value: 1 },
      { type: 'skill', target: 'stealth', action: 'set', value: 5 },
      { type: 'item', target: 'totem', action: 'add', quantity: 2, autoEquip: true },
      { type: 'experience', value: 250 },
      { type: 'health', value: -150, canKill: true },
      { type: 'mana', value: -2 },
      { type: 'gold', value: 50 },
      { type: 'relationship', target: 'npc.boril', value: 10 },
      { type: 'unlock_shop', target: 'blacksmith' },
      { type: 'unlock_dialogue', target: 'npc.elena' },
      { type: 'unlock_quest', target: 'quest.rescue' },
      { type: 'unlock_location', target: 'ancient_ruins' },
      { type: 'trigger_event', target: 'cinematic.start', data: { id: 42 } },
      { type: 'set_location', target: 'ancient_ruins' },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(result.success).toBe(true);
    expect(result.warnings).toHaveLength(0);

    expect(gameState.flags['quest.started']).toBe(true);
    expect(gameState.counters['kills']).toBe(2);
    expect(character.attributes.strength).toBe(9);
    expect(character.skills.stealth).toBe(5);
    expect(character.inventory.find((item) => item.id === 'totem')?.quantity).toBe(2);
    expect(character.level).toBe(3);
    expect(character.experience).toBe(50);
    expect(character.health).toBe(0);
    expect(character.mana).toBe(8);
    expect(character.gold).toBe(50);
    expect(gameState.relationships['npc.boril']).toBe(10);
    expect(gameState.unlockedShops).toContain('blacksmith');
    expect(gameState.unlockedLocations).toContain('ancient_ruins');
    expect(gameState.location).toBe('ancient_ruins');

    expect(result.events).toEqual(
      expect.arrayContaining([
        { type: 'item_change', action: 'add', itemId: 'totem', quantity: 2 },
        { type: 'gold_change', newTotal: 50 },
        { type: 'unlock', category: 'shop', id: 'blacksmith' },
        { type: 'unlock', category: 'location', id: 'ancient_ruins' },
        { type: 'death' },
        { type: 'level_up', newLevel: 3 },
        { type: 'trigger_event', eventName: 'cinematic.start', data: { id: 42 } },
      ]),
    );
  });

  it('guards invalid data, clamps resources и dedуплицира unlock-и', async () => {
    const gameState = createGameState();
    const character = createCharacter();
    gameState.relationships['npc.friend'] = 95;

    const consequences: Consequence[] = [
      { type: 'counter', target: 'steps', action: 'increment', value: Number.POSITIVE_INFINITY },
      { type: 'stat', target: 'mysticism', action: 'increase', value: 3 },
      { type: 'skill', target: 'alchemy', action: 'increase', value: 2 },
      { type: 'mana', value: -20 },
      { type: 'relationship', target: 'npc.friend', value: 10 },
      { type: 'relationship', target: 'npc.enemy', value: -250 },
      { type: 'unlock_shop', target: 'bazaar' },
      { type: 'unlock_shop', target: 'bazaar' },
      { type: 'trigger_event', target: 'vision', data: { severity: 'high' } },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(gameState.counters['steps']).toBeUndefined();
    expect(character.attributes.mysticism).toBe(3);
    expect(character.skills.alchemy).toBe(2);
    expect(character.mana).toBe(0);
    expect(gameState.relationships['npc.friend']).toBe(100);
    expect(gameState.relationships['npc.enemy']).toBe(-100);
    expect(gameState.unlockedShops).toEqual(['bazaar']);

    expect(result.events).toEqual(
      expect.arrayContaining([
        { type: 'unlock', category: 'shop', id: 'bazaar' },
        { type: 'relationship_change', target: 'npc.friend', value: 100 },
        { type: 'relationship_change', target: 'npc.enemy', value: -100 },
        { type: 'trigger_event', eventName: 'vision', data: { severity: 'high' } },
      ]),
    );

    expect(result.warnings).toEqual(
      expect.arrayContaining([
        'Counter consequence received non-finite value',
        expect.stringContaining("Unknown stat 'mysticism'"),
        expect.stringContaining("Unknown skill 'alchemy'"),
      ]),
    );

    expect(debugSpy).toHaveBeenCalledWith('[ConsequenceApplicator] Event triggered', {
      eventName: 'vision',
      data: { severity: 'high' },
    });
  });

  it('removes items, освобождава екипировка и предупреждава при недостиг', async () => {
    const gameState = createGameState();
    const character = createCharacter();
    character.inventory = [...character.inventory, { id: 'herb', quantity: 1 }];
    character.equipment.weapon = { id: 'herb', quantity: 1, equipped: true } as any;

    const consequences: Consequence[] = [
      { type: 'item', target: 'herb', action: 'remove', quantity: 3 },
      { type: 'gold', value: -10 },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(character.inventory.find((item) => item.id === 'herb')).toBeUndefined();
    expect(character.equipment.weapon).toBeUndefined();
    expect(character.gold).toBe(0);

    expect(result.events).toEqual(
      expect.arrayContaining([
        { type: 'item_change', action: 'remove', itemId: 'herb', quantity: 1 },
        { type: 'gold_change', newTotal: 0 },
      ]),
    );

    expect(result.warnings).toContain('Attempted to remove more items than owned for herb');
  });

  it('emits unlock and trigger events (non-duplicate) and tracks mana/gold deltas', async () => {
    const gameState = createGameState();
    const character = createCharacter();

    const consequences: Consequence[] = [
      { type: 'unlock_location', target: 'hidden_cave' },
      { type: 'unlock_location', target: 'hidden_cave' },
      { type: 'unlock_dialogue', target: 'npc.guide' },
      { type: 'trigger_event', target: 'ambient.rumble', data: { intensity: 3 } },
      { type: 'mana', value: 5 },
      { type: 'gold', value: 25 },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(gameState.unlockedLocations).toEqual(['hidden_cave']);
    expect(gameState.unlockedDialogues).toEqual(['npc.guide']);
    expect(character.mana).toBe(character.maxMana);
    expect(character.gold).toBe(25);
    expect(result.events).toEqual(
      expect.arrayContaining([
        { type: 'unlock', category: 'location', id: 'hidden_cave' },
        { type: 'unlock', category: 'dialogue', id: 'npc.guide' },
        { type: 'trigger_event', eventName: 'ambient.rumble', data: { intensity: 3 } },
        { type: 'gold_change', newTotal: 25 },
      ]),
    );
    expect(result.warnings).toHaveLength(0);
  });

  it('handles level-up side effects and death events after applying experience+health', async () => {
    const gameState = createGameState();
    const character = createCharacter();

    const consequences: Consequence[] = [
      { type: 'experience', value: 200 },
      { type: 'health', value: -200, canKill: true },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'level_up' }),
        { type: 'death' },
      ]),
    );
    expect(character.level).toBeGreaterThan(1);
    expect(character.health).toBe(0);
  });

  it('rolls back the entire transaction when a consequence throws', async () => {
    const gameState = createGameState();
    const character = createCharacter();
    const initialHealth = character.health;

    const consequences: Consequence[] = [
      { type: 'flag', target: 'quest.failed', value: true },
      { type: 'health', value: -999, canKill: false },
    ];

    const result = await ConsequenceApplicator.apply(consequences, gameState, character);

    expect(result.success).toBe(false);
    expect(gameState.flags['quest.failed']).toBeUndefined();
    expect(character.health).toBe(initialHealth);
    expect(result.warnings).toContain('Transaction rolled back due to error');
  });
});

function createGameState(): GameState {
  return {
    currentScenario: null,
    flags: {},
    counters: {},
    location: 'kamenitsa_home',
    relationships: {},
    unlockedShops: [],
    unlockedDialogues: [],
    unlockedQuests: [],
    unlockedLocations: [],
    dialogueHistory: [],
    scenarioHistory: [],
    gameTime: { day: 1, hour: 6, period: 'morning' },
    metadata: { createdAt: 0, updatedAt: 0, version: '1.0.0', contentVersion: '1.0.0', playtime: 0 },
  };
}

function createCharacter(): PlayerCharacter {
  return {
    name: 'Test Hero',
    level: 1,
    experience: 0,
    health: 150,
    maxHealth: 150,
    mana: 10,
    maxMana: 10,
    gold: 0,
    attributes: {
      strength: 8,
      agility: 7,
      intelligence: 6,
      charisma: 5,
      wisdom: 4,
      vitality: 9,
    },
    skills: {
      stealth: 1,
      persuasion: 2,
    },
    inventory: [],
    equipment: {},
  };
}
