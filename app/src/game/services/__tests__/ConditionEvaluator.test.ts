import { ConditionEvaluator, evaluateCondition, evaluateConditions, explainConditionFailure } from '../ConditionEvaluator';
import { GameState } from '../../types/gameState';
import { PlayerCharacter } from '../../types/character';
import { Condition, FlagCondition, ItemCondition } from '../../types/condition';

describe('ConditionEvaluator', () => {
  let gameState: GameState;
  let character: PlayerCharacter;

  beforeEach(() => {
    gameState = createMockGameState();
    character = createMockCharacter();
  });

  it('evaluates flag conditions', () => {
    gameState.flags['quest.completed'] = true;
    const condition: Condition = { type: 'flag', target: 'quest.completed', value: true };

    expect(evaluateCondition(condition, gameState, character)).toBe(true);
  });

  it('evaluates counter comparisons', () => {
    gameState.counters['kills'] = 7;
    const condition: Condition = {
      type: 'counter',
      target: 'kills',
      operator: 'greater_equal',
      value: 5,
    };

    expect(evaluateCondition(condition, gameState, character)).toBe(true);
  });

  it('falls back to default values for undefined stats/skills', () => {
    const statCondition: Condition = {
      type: 'stat',
      target: 'luck',
      operator: 'greater_than',
      value: 0,
    };
    const skillCondition: Condition = {
      type: 'skill',
      target: 'lockpicking',
      operator: 'greater_equal',
      value: 10,
    };

    expect(evaluateCondition(statCondition, gameState, character)).toBe(false);
    expect(evaluateCondition(skillCondition, gameState, character)).toBe(false);
  });

  it('checks inventory quantities and equipment', () => {
    character.inventory.push({ id: 'totem', quantity: 2 });
    character.equipment.weapon = { id: 'totem' };

    const qtyCondition: Condition = { type: 'item', target: 'totem', quantity: 2 };
    const equipCondition: Condition = { type: 'item', target: 'totem', equipped: true };

    expect(evaluateCondition(qtyCondition, gameState, character)).toBe(true);
    expect(evaluateCondition(equipCondition, gameState, character)).toBe(true);
  });

  it('handles relationship, level, location, and time conditions', () => {
    gameState.relationships['npc.boril'] = -5;
    const relationshipCondition: Condition = {
      type: 'relationship',
      target: 'npc.boril',
      operator: 'less_than',
      value: 0,
    };
    const levelCondition: Condition = {
      type: 'level',
      operator: 'greater_equal',
      value: 3,
    };
    const locationCondition: Condition = { type: 'location', target: 'kamenitsa_home' };
    const timeCondition: Condition = { type: 'time', operator: 'equals', value: 10 };

    expect(evaluateCondition(relationshipCondition, gameState, character)).toBe(true);
    expect(evaluateCondition(levelCondition, gameState, character)).toBe(true);
    expect(evaluateCondition(locationCondition, gameState, character)).toBe(true);
    expect(evaluateCondition(timeCondition, gameState, character)).toBe(true);
  });

  it('supports logical operators AND/OR/NOT with short-circuit behavior', () => {
    gameState.flags['a'] = true;
    const andCondition: Condition = {
      type: 'and',
      conditions: [
        { type: 'flag', target: 'a', value: true },
        { type: 'flag', target: 'missing', value: true },
      ],
    };

    const orCondition: Condition = {
      type: 'or',
      conditions: [
        { type: 'flag', target: 'a', value: true },
        { type: 'flag', target: 'missing', value: true },
      ],
    };

    const notCondition: Condition = {
      type: 'not',
      condition: { type: 'flag', target: 'missing', value: true },
    };

    expect(evaluateCondition(andCondition, gameState, character)).toBe(false);
    expect(evaluateCondition(orCondition, gameState, character)).toBe(true);
    expect(evaluateCondition(notCondition, gameState, character)).toBe(true);
  });

  it('evaluates multiple conditions via helpers', () => {
    gameState.flags['alpha'] = true;
    const conditions: Condition[] = [
      { type: 'flag', target: 'alpha', value: true },
      { type: 'level', operator: 'greater_than', value: 1 },
    ];

    expect(evaluateConditions(conditions, gameState, character)).toBe(true);
  });

  it('explains failures for easier debugging', () => {
    const condition: Condition = { type: 'flag', target: 'never-set', value: true };
    const explanation = explainConditionFailure(condition, gameState, character);

    expect(explanation).toContain("expected true");
  });

  it('warns when detecting impossible conditions', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const condition: ItemCondition = { type: 'item', target: 'artifact', quantity: 0 };

    ConditionEvaluator.evaluate(condition, gameState, character);

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('evaluates 100 simple conditions under 50ms', () => {
    const conditions: FlagCondition[] = Array.from({ length: 100 }, (_, index) => ({
      type: 'flag',
      target: `speed.flag.${index}`,
      value: true,
    }));

    conditions.forEach((condition) => {
      gameState.flags[condition.target] = true;
    });

    const start = Date.now();
    const result = evaluateConditions(conditions, gameState, character);
    const duration = Date.now() - start;

    expect(result).toBe(true);
    expect(duration).toBeLessThan(50);
  });
});

function createMockGameState(): GameState {
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
    gameTime: { day: 1, hour: 10, period: 'morning' },
    metadata: {
      createdAt: 0,
      updatedAt: 0,
      version: '1.0.0',
      contentVersion: '1.0.0',
      playtime: 0,
    },
  };
}

function createMockCharacter(): PlayerCharacter {
  return {
    level: 5,
    attributes: {
      strength: 10,
      agility: 8,
      intelligence: 7,
      charisma: 4,
      wisdom: 6,
      vitality: 9,
    },
    skills: {
      persuasion: 5,
      stealth: 3,
    },
    inventory: [],
    equipment: {},
  };
}
