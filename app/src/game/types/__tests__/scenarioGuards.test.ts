import { isChoice, isScenario, Choice, Scenario } from '@/game/types';

describe('Scenario & Choice guards', () => {
  const baseChoice: Choice = {
    id: 'choice-1',
    textKey: 'choices.a',
    conditions: [],
    consequences: [],
    nextScenario: 'next',
  };

  const baseScenario: Scenario = {
    id: 'scenario-1',
    titleKey: 'scenarios.one.title',
    textKey: 'scenarios.one.text',
    act: 1,
    scene: 2,
    locationId: 'belintash',
    choices: [baseChoice],
    prerequisites: [],
    npcsPresent: [],
  };

  it('разпознава валидни обекти', () => {
    expect(isChoice(baseChoice)).toBe(true);
    expect(isScenario(baseScenario)).toBe(true);
  });

  it('отрязва невалидни стойности', () => {
    const invalidChoice = { ...baseChoice, id: undefined } as unknown;
    const invalidScenario = { ...baseScenario, act: -1 } as unknown;

    expect(isChoice(invalidChoice)).toBe(false);
    expect(isScenario(invalidScenario)).toBe(false);
  });
});
