import { VariableInterpolator } from '../VariableInterpolator';
import { GameState } from '../../types/gameState';
import { PlayerCharacter } from '../../types/character';

describe('VariableInterpolator - Task 1', () => {
  let gameState: GameState;
  let character: PlayerCharacter;

  beforeEach(() => {
    gameState = createMockGameState();
    character = createMockCharacter();
  });

  it('replaces simple variables with values from character and game state', () => {
    gameState.location = 'belintash';
    const text = 'Здравей, {{playerName}}! Имаш {{gold}} злато и си в {{location}} (ден {{day}}, час {{hour}}).';

    const result = VariableInterpolator.interpolate(text, gameState, character);

    expect(result).toBe('Здравей, Test Hero! Имаш 25 злато и си в belintash (ден 3, час 11).');
  });

  it('warns and preserves placeholder when variable is unknown', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const text = 'Това е {{unknownValue}}.';

    const result = VariableInterpolator.interpolate(text, gameState, character);

    expect(result).toBe('Това е {{unknownValue}}.');
    expect(warnSpy).toHaveBeenCalledWith('Unknown variable: unknownValue');

    warnSpy.mockRestore();
  });

  it('applies formatters and falls back gracefully', () => {
    const text = '{{gold|number}} {{playerName|upper}} {{location|lower}}';
    gameState.location = 'BELINTASH';
    character.gold = 1234;

    const result = VariableInterpolator.interpolate(text, gameState, character, {
      formatNumber: (value) => `BG-${value.toFixed(2)}`,
    });

    expect(result).toBe('BG-1234.00 TEST HERO belintash');
  });

  it('handles flag conditional expressions', () => {
    gameState.flags['has_sword'] = true;
    const armedText = 'Ти си {{flag:has_sword|въоръжен|невъоръжен}}.';
    const unknownFlagText = 'Статус: {{flag:missing_flag|да|не}}.';

    expect(VariableInterpolator.interpolate(armedText, gameState, character)).toBe('Ти си въоръжен.');
    expect(VariableInterpolator.interpolate(unknownFlagText, gameState, character)).toBe('Статус: не.');
  });

  it('formats numbers with default formatter when i18n is absent', () => {
    character.gold = 1234567;
    const text = '{{gold|number}}';

    expect(VariableInterpolator.interpolate(text, gameState, character)).toBe('1\u00a0234\u00a0567');
  });

  it('handles missing flag names gracefully', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const text = 'Статус: {{flag:   |да|не}}.';

    expect(VariableInterpolator.interpolate(text, gameState, character)).toBe('Статус: .');
    expect(warnSpy).toHaveBeenCalledWith('Flag conditional missing flag name');

    warnSpy.mockRestore();
  });

  it('supports hour alias and keeps unknown formatter output', () => {
    const text = 'Час {{hour}} / {{gameTime.hour}} / {{gold|unknown}}';

    const result = VariableInterpolator.interpolate(text, gameState, character);

    expect(result).toBe('Час 11 / 11 / 25');
  });

  it('falls back when formatter receives NaN values', () => {
    const text = '{{playerName|number}} {{gold|upper}}';

    const result = VariableInterpolator.interpolate(text, gameState, character);

    expect(result).toBe('Test Hero 25');
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
    gameTime: { day: 3, hour: 11, period: 'morning' },
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
    name: 'Test Hero',
    level: 7,
    experience: 150,
    health: 40,
    maxHealth: 60,
    mana: 20,
    maxMana: 30,
    gold: 25,
    attributes: {
      strength: 9,
      agility: 6,
      intelligence: 8,
      charisma: 5,
      wisdom: 6,
      vitality: 7,
    },
    skills: {
      archery: 3,
      diplomacy: 4,
    },
    inventory: [],
    equipment: {},
  };
}
