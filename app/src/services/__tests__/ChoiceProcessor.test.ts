import { ChoiceProcessor, ChoiceProcessingError, ChoiceUnavailableError } from '../ChoiceProcessor';
import { ConditionEvaluator } from '@/game/services/ConditionEvaluator';
import { ConsequenceApplicator } from '@/game/services/ConsequenceApplicator';
import { ScenarioLoader } from '../scenarioLoader';
import { performSkillCheck } from '@/game/types/skillCheck';
import type { Choice } from '@/game/types/scenario';
import type { GameState } from '@/game/types/gameState';
import type { PlayerCharacter } from '@/game/types/character';

jest.mock('@/game/services/ConditionEvaluator', () => ({
  ConditionEvaluator: {
    evaluateAll: jest.fn(),
  },
}));

jest.mock('@/game/services/ConsequenceApplicator', () => ({
  ConsequenceApplicator: {
    apply: jest.fn(() => ({ success: true, events: [], warnings: [] })),
  },
}));

jest.mock('../ScenarioLoader', () => ({
  ScenarioLoader: {
    getInstance: jest.fn(() => ({
      loadScenario: jest.fn(() => ({ id: 'scenario-b' })),
    })),
  },
}));

jest.mock('@/game/types/skillCheck', () => {
  const actual = jest.requireActual('@/game/types/skillCheck');
  return {
    ...actual,
    performSkillCheck: jest.fn(),
  };
});

const mockEvaluateAll = ConditionEvaluator.evaluateAll as jest.MockedFunction<
  typeof ConditionEvaluator.evaluateAll
>;
const mockApply = ConsequenceApplicator.apply as jest.MockedFunction<typeof ConsequenceApplicator.apply>;
const mockGetLoader = ScenarioLoader.getInstance as jest.Mock;
const mockPerformSkillCheck = performSkillCheck as jest.MockedFunction<typeof performSkillCheck>;

const getLastLoader = () =>
  (mockGetLoader.mock.results.at(-1)?.value as { loadScenario: jest.Mock }) ?? {
    loadScenario: jest.fn(),
  };

describe('ChoiceProcessor', () => {
  let gameState: GameState;
  let character: PlayerCharacter;
  let baseChoice: Choice;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1);

    gameState = {
      currentScenario: null,
      flags: {},
      counters: {},
      location: 'kamenitsa',
      relationships: {},
      unlockedShops: [],
      unlockedDialogues: [],
      unlockedQuests: [],
      unlockedLocations: [],
      dialogueHistory: [],
      scenarioHistory: [],
      gameTime: { day: 1, hour: 8, period: 'morning' },
      metadata: {
        createdAt: 0,
        updatedAt: 0,
        version: '1.0.0',
        contentVersion: '1.0.0',
        playtime: 0,
      },
    };

    character = {
      name: 'Test Hero',
      level: 5,
      experience: 100,
      health: 40,
      maxHealth: 40,
      mana: 10,
      maxMana: 10,
      gold: 50,
      attributes: {
        strength: 12,
        agility: 11,
        intelligence: 14,
        charisma: 16,
        wisdom: 13,
        vitality: 10,
      },
      skills: {
        persuasion: 30,
      },
      inventory: [],
      equipment: {},
    };

    baseChoice = {
      id: 'choice-1',
      textKey: 'choice.one',
      conditions: [],
      consequences: [{ type: 'flag', target: 'met_villager', value: true }],
      nextScenario: 'scenario-b',
    } as Choice;

    mockGetLoader.mockImplementation(() => ({
      loadScenario: jest.fn(async () => ({ id: 'scenario-b' } as any)),
    }));

    mockEvaluateAll.mockReturnValue(true);
    mockApply.mockResolvedValue({ success: true, events: [], warnings: [] });
    mockPerformSkillCheck.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('processes successful choice without skill check', async () => {
    const scenario = { id: 'scenario-a' } as any;

    const result = await ChoiceProcessor.processChoice(baseChoice, scenario, gameState, character);

    expect(result.type).toBe('success');
    if (result.type !== 'success') {
      throw new Error('Expected success result');
    }
    expect(result.nextScenario).toEqual({ id: 'scenario-b' });
    expect(result.skillCheckResult).toBeUndefined();
    const loader = getLastLoader();
    expect(loader.loadScenario).toHaveBeenCalledWith('scenario-b');
    expect(gameState.currentScenario).toEqual({ id: 'scenario-b' });
    expect(gameState.scenarioHistory).toHaveLength(1);
    expect(gameState.scenarioHistory[0]).toMatchObject({ scenarioId: 'scenario-a', choiceId: 'choice-1' });
  });

  it('throws ChoiceUnavailableError when conditions fail', async () => {
    mockEvaluateAll.mockReturnValueOnce(false);
    const scenario = { id: 'scenario-a' } as any;

    await expect(
      ChoiceProcessor.processChoice(baseChoice, scenario, gameState, character),
    ).rejects.toBeInstanceOf(ChoiceUnavailableError);

    expect(mockApply).not.toHaveBeenCalled();
  });

  it('handles skill check failure path with failure consequences and nextScenarioOnFailure', async () => {
    const loader = {
      loadScenario: jest.fn(async () => ({ id: 'scenario-b' } as any)),
    };
    mockGetLoader.mockReturnValue(loader);

    const choice: Choice = {
      ...baseChoice,
      failureConsequences: [{ type: 'flag', target: 'failed', value: true }],
      nextScenarioOnFailure: 'scenario-failure',
      skillCheck: { skill: 'persuasion', dc: 18 },
    };

    mockPerformSkillCheck.mockReturnValue({ success: false } as any);
    loader.loadScenario.mockResolvedValueOnce({ id: 'scenario-failure' } as any);
    const scenario = { id: 'scenario-a' } as any;

    const result = await ChoiceProcessor.processChoice(choice, scenario, gameState, character);

    expect(mockPerformSkillCheck).toHaveBeenCalled();
    expect(mockApply).toHaveBeenCalledWith(choice.failureConsequences, gameState, character);
    expect(result.type).toBe('success');
    if (result.type !== 'success') {
      throw new Error('Expected success result');
    }
    expect(result.nextScenario).toEqual({ id: 'scenario-failure' });
    expect(result.skillCheckResult).toEqual({ success: false });
  });

  it('returns death result when character health drops to zero', async () => {
    mockApply.mockImplementation(async () => {
      character.health = 0;
      return { success: true, events: [{ type: 'death' }], warnings: [] } as any;
    });

    const scenario = { id: 'scenario-a' } as any;

    const result = await ChoiceProcessor.processChoice(baseChoice, scenario, gameState, character);

    expect(result.type).toBe('death');
    const loader = getLastLoader();
    expect(loader.loadScenario).not.toHaveBeenCalled();
  });

  it('wraps ConsequenceApplicator failures in ChoiceProcessingError', async () => {
    mockApply.mockResolvedValue({ success: false, error: new Error('boom'), events: [], warnings: [] });
    const scenario = { id: 'scenario-a' } as any;

    await expect(
      ChoiceProcessor.processChoice(baseChoice, scenario, gameState, character),
    ).rejects.toBeInstanceOf(ChoiceProcessingError);
  });

  it('throws ChoiceProcessingError when next scenario ID is missing', async () => {
    const choice: Choice = {
      ...baseChoice,
      nextScenario: '',
      failureConsequences: [],
    };

    const scenario = { id: 'scenario-a' } as any;

    await expect(
      ChoiceProcessor.processChoice(choice, scenario, gameState, character),
    ).rejects.toBeInstanceOf(ChoiceProcessingError);
  });
});
