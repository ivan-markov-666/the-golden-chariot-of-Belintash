import { isSkillCheck, performSkillCheck, SkillCheck, SkillCheckSchema } from '../skillCheck';

describe('SkillCheck runtime helpers', () => {
  const baseCheck: SkillCheck = {
    skill: 'persuasion',
    dc: 15,
    minRoll: 5,
    maxRoll: 18,
  };

  afterEach(() => {
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('валидара payload и type guard', () => {
    expect(isSkillCheck(baseCheck)).toBe(true);
    expect(() => SkillCheckSchema.parse(baseCheck)).not.toThrow();

    const invalid = { ...baseCheck, skill: 'unknown' } as unknown;
    expect(isSkillCheck(invalid)).toBe(false);
  });

  it('клампва хвърлянията спрямо min/max граници', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // roll 1
    const minResult = performSkillCheck({ ...baseCheck, minRoll: 12 }, 0, 0);
    expect(minResult.roll).toBe(12);

    jest.spyOn(Math, 'random').mockReturnValue(0.999); // roll 20
    const maxResult = performSkillCheck({ ...baseCheck, maxRoll: 10 }, 0, 0);
    expect(maxResult.roll).toBe(10);
  });

  it('предпочита критичен успех/провал пред тотала', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999);
    const critSuccess = performSkillCheck({ ...baseCheck, maxRoll: undefined }, 0, -20);
    expect(critSuccess.criticalSuccess).toBe(true);
    expect(critSuccess.success).toBe(true);

    jest.spyOn(Math, 'random').mockReturnValue(0);
    const critFailure = performSkillCheck({ ...baseCheck, minRoll: undefined }, 100, 50);
    expect(critFailure.criticalFailure).toBe(true);
    expect(critFailure.success).toBe(false);
  });
});
