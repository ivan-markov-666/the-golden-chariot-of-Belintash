import {
  Condition,
  ConditionSchema,
  Consequence,
  ConsequenceSchema,
  GameStateSchema,
  SkillCheck,
  SkillCheckSchema,
  createInitialGameState,
  isCondition,
  isConditionType,
  isConsequence,
  isGameState,
  performSkillCheck,
} from '@/game/types';

describe('ConditionSchema & helpers', () => {
  const conditionCases: Array<[string, Condition]> = [
    ['flag', { type: 'flag', target: 'story.flag', value: true }],
    ['counter', { type: 'counter', target: 'kill_count', operator: 'greater_than', value: 3 }],
    ['stat', { type: 'stat', target: 'strength', operator: 'greater_equal', value: 12 }],
    ['skill', { type: 'skill', target: 'persuasion', operator: 'greater_equal', value: 5 }],
    ['item', { type: 'item', target: 'totem', quantity: 1, equipped: true }],
    ['relationship', { type: 'relationship', target: 'npc.boril', operator: 'less_equal', value: -2 }],
    ['level', { type: 'level', operator: 'greater_equal', value: 10 }],
    ['location', { type: 'location', target: 'belintash' }],
    ['time', { type: 'time', operator: 'greater_equal', value: 18 }],
    [
      'and/or/not',
      {
        type: 'and',
        conditions: [
          { type: 'or', conditions: [{ type: 'flag', target: 'a', value: true }, { type: 'flag', target: 'b', value: true }] },
          { type: 'not', condition: { type: 'flag', target: 'c', value: false } },
        ],
      },
    ],
  ];

  it.each(conditionCases)('parses %s conditions', (_, condition) => {
    expect(() => ConditionSchema.parse(condition)).not.toThrow();
    expect(isCondition(condition)).toBe(true);
  });

  it('rejects invalid condition payloads', () => {
    const invalid = { type: 'flag', target: 'bad' };
    expect(() => ConditionSchema.parse(invalid as Condition)).toThrow();
    expect(isCondition(invalid)).toBe(false);
  });

  it('validates condition discriminators', () => {
    expect(isConditionType('flag')).toBe(true);
    expect(isConditionType('unknown')).toBe(false);
    expect(isConditionType(42)).toBe(false);
  });
});

describe('ConsequenceSchema', () => {
  const consequenceCases: Array<[string, Consequence]> = [
    ['flag', { type: 'flag', target: 'quest.complete', value: true }],
    ['counter', { type: 'counter', target: 'steps', action: 'increment', value: 1 }],
    ['stat', { type: 'stat', target: 'strength', action: 'increase', value: 2 }],
    ['skill', { type: 'skill', target: 'perception', action: 'set', value: 9 }],
    ['item', { type: 'item', target: 'amulet', action: 'add', quantity: 1, autoEquip: true }],
    ['experience', { type: 'experience', value: 150 }],
    ['health', { type: 'health', value: -10, canKill: true }],
    ['mana', { type: 'mana', value: 5 }],
    ['gold', { type: 'gold', value: 200 }],
    ['relationship', { type: 'relationship', target: 'npc.ivan', value: 3 }],
    ['unlock_shop', { type: 'unlock_shop', target: 'blacksmith' }],
    ['unlock_dialogue', { type: 'unlock_dialogue', target: 'npc.elena' }],
    ['unlock_quest', { type: 'unlock_quest', target: 'quest.totem', autoStart: true }],
    ['unlock_location', { type: 'unlock_location', target: 'secret_cave' }],
    ['trigger_event', { type: 'trigger_event', target: 'cutscene.intro', data: { mood: 'tense' } }],
    ['set_location', { type: 'set_location', target: 'kamenitsa_square' }],
  ];

  it.each(consequenceCases)('parses %s consequences', (_, consequence) => {
    expect(() => ConsequenceSchema.parse(consequence)).not.toThrow();
  });

  it('rejects invalid consequence payloads', () => {
    const invalid = { type: 'gold', value: 'a lot' };
    expect(() => ConsequenceSchema.parse(invalid as unknown as Consequence)).toThrow();
  });

  it('exposes an isConsequence type guard', () => {
    const valid: Consequence = { type: 'gold', value: 10 };
    expect(isConsequence(valid)).toBe(true);
    expect(isConsequence({ type: 'gold', value: 'oops' })).toBe(false);
  });
});

describe('SkillCheckSchema & performSkillCheck', () => {
  const skillCheck: SkillCheck = {
    skill: 'persuasion',
    dc: 12,
    difficultyTier: 'standard',
    minRoll: 5,
    maxRoll: 18,
  };

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('validates skill check payloads', () => {
    expect(() => SkillCheckSchema.parse(skillCheck)).not.toThrow();
    expect(() => SkillCheckSchema.parse({ ...skillCheck, dc: 0 })).toThrow();
  });

  it('clamps roll to the specified minimum', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // produces roll of 1
    const result = performSkillCheck({ ...skillCheck, minRoll: 15 }, 0, 0);
    expect(result.roll).toBe(15);
    expect(result.total).toBeGreaterThanOrEqual(15);
  });

  it('clamps roll to the specified maximum', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999); // produces roll of 20
    const result = performSkillCheck({ ...skillCheck, maxRoll: 10 }, 10, 0);
    expect(result.roll).toBe(10);
    expect(result.total).toBeLessThanOrEqual(20);
  });

  it('treats natural 20 as critical success even if total < DC', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999);
    const result = performSkillCheck({ ...skillCheck, maxRoll: undefined }, 0, -10);
    expect(result.criticalSuccess).toBe(true);
    expect(result.success).toBe(true);
  });

  it('treats natural 1 as critical failure even if total >= DC', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = performSkillCheck({ ...skillCheck, minRoll: undefined }, 100, 10);
    expect(result.criticalFailure).toBe(true);
    expect(result.success).toBe(false);
  });
});

describe('GameStateSchema & helpers', () => {
  it('produces a schema-compliant initial state', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    const state = createInitialGameState();

    expect(GameStateSchema.parse(state)).toEqual(state);
    expect(state.metadata.createdAt).toBe(1_700_000_000_000);
    expect(state.metadata.updatedAt).toBe(1_700_000_000_000);

    nowSpy.mockRestore();
  });

  it('validates game state guard helpers', () => {
    const valid = GameStateSchema.parse(createInitialGameState());
    const invalid = { foo: 'bar' };

    expect(isGameState(valid)).toBe(true);
    expect(isGameState(invalid)).toBe(false);
  });
});
