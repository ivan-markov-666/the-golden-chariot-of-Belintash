import { ChoiceProcessor } from '../ChoiceProcessor';
import {
  ScenarioLoader,
  clearScenarioCache,
  getScenarioCacheStats,
} from '../scenarioLoader';
import { createInitialGameState, GameState } from '../../game/types/gameState';
import { PlayerCharacter } from '../../game/types/character';
import * as SkillCheckModule from '../../game/types/skillCheck';

const buildScenario = (id: string, overrides = {}) => ({
  id,
  titleKey: `scenarios.${id}.title`,
  textKey: `scenarios.${id}.text`,
  act: 1,
  scene: 1,
  locationId: 'integration_site',
  choices: [],
  prerequisites: [],
  npcsPresent: [],
  metadata: undefined,
  ...overrides,
});

const buildChoice = () => ({
  id: 'integration-choice',
  textKey: 'choices.integration',
  conditions: [{ type: 'flag', target: 'integration_ready', value: true }],
  skillCheck: { skill: 'persuasion', dc: 10 },
  consequences: [{ type: 'flag', target: 'won_trial', value: true }],
  failureConsequences: [{ type: 'health', value: -999, canKill: true }],
  nextScenario: 'integration-success',
  nextScenarioOnFailure: 'integration-failure',
});

jest.mock('@/game/data/scenarioManifest', () => ({
  scenarioManifest: {
    'integration-start': async () => buildScenario('integration-start', { choices: [buildChoice()] }),
    'integration-success': async () => buildScenario('integration-success'),
    'integration-failure': async () => buildScenario('integration-failure'),
  },
}));

const createTestCharacter = () => ({
  name: 'Integration Hero',
  level: 5,
  experience: 100,
  health: 40,
  maxHealth: 40,
  mana: 10,
  maxMana: 10,
  gold: 20,
  attributes: {
    strength: 12,
    agility: 11,
    intelligence: 14,
    charisma: 15,
    wisdom: 10,
    vitality: 12,
  },
  skills: {
    persuasion: 30,
  },
  inventory: [],
  equipment: {},
});

describe('Engine integration', () => {
  let gameState: GameState;
  let character: PlayerCharacter;
  let skillCheckSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(123_456);
    gameState = createInitialGameState();
    character = createTestCharacter();
    gameState.flags.integration_ready = true;
    clearScenarioCache();
    skillCheckSpy = jest.spyOn(SkillCheckModule, 'performSkillCheck');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    clearScenarioCache();
  });

  it('processes full choice flow and caches scenarios on success', async () => {
    skillCheckSpy.mockReturnValue({
      success: true,
      skill: 'persuasion',
      roll: 15,
      total: 20,
      dc: 10,
    });

    const loader = ScenarioLoader.getInstance();
    const startScenario = await loader.loadScenario('integration-start');
    gameState.currentScenario = startScenario;
    const choice = startScenario.choices[0];

    const result = await ChoiceProcessor.processChoice(choice, startScenario, gameState, character);

    expect(result.type).toBe('success');
    if (result.type !== 'success') {
      return fail('expected success result');
    }

    expect(result.skillCheckResult?.success).toBe(true);
    expect(gameState.currentScenario?.id).toBe('integration-success');
    expect(gameState.flags.won_trial).toBe(true);
    expect(gameState.scenarioHistory).toHaveLength(1);
    expect(gameState.scenarioHistory[0].choiceId).toBe(choice.id);

    const stats = getScenarioCacheStats();
    expect(stats.loaded).toBeGreaterThanOrEqual(2);
    expect(stats.entries.map((entry) => entry.id)).toEqual(
      expect.arrayContaining(['integration-start', 'integration-success']),
    );
  });

  it('handles failure path with death and avoids unnecessary loads', async () => {
    skillCheckSpy.mockReturnValue({
      success: false,
      skill: 'persuasion',
      roll: 5,
      total: 7,
      dc: 10,
    });

    const loader = ScenarioLoader.getInstance();
    const startScenario = await loader.loadScenario('integration-start');
    gameState.currentScenario = startScenario;
    const choice = startScenario.choices[0];

    const result = await ChoiceProcessor.processChoice(choice, startScenario, gameState, character);

    expect(result.type).toBe('death');
    expect(gameState.currentScenario?.id).toBe('integration-start');
    const stats = getScenarioCacheStats();
    expect(stats.loaded).toBe(1);
    expect(stats.entries[0].id).toBe('integration-start');
  });
});
