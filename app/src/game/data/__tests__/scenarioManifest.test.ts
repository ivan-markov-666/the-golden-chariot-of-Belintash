import { scenarioManifest } from '../scenarioManifest';
import type { Scenario } from '@/game/types';

describe('scenarioManifest', () => {
  it('експортира резолвери за наличните сценарии', async () => {
    await expect(scenarioManifest['test-scenario-1']()).resolves.toMatchObject({
      id: 'test-scenario-1',
    } satisfies Partial<Scenario>);
    await expect(scenarioManifest['invalid-scenario']()).resolves.toMatchObject({
      id: 'invalid-scenario',
    } satisfies Partial<Scenario>);
  });

  it('има фиксиран списък от сценарии, който може да се обхожда', () => {
    expect(Object.keys(scenarioManifest).sort()).toEqual([
      'invalid-scenario',
      'test-scenario-1',
    ]);
  });

  it('поддържа async обход по стойности', async () => {
    const results = await Promise.all(Object.values(scenarioManifest).map((resolver) => resolver()));
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'test-scenario-1' }),
        expect.objectContaining({ id: 'invalid-scenario' }),
      ]),
    );
  });
});
