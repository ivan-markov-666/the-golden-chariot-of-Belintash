import { Scenario } from '@/game/types';
import { ScenarioCache } from '../ScenarioCache';

const buildScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'scenario-x',
  titleKey: 'title',
  textKey: 'text',
  act: 0,
  scene: 0,
  locationId: 'loc',
  choices: [],
  prerequisites: [],
  npcsPresent: [],
  metadata: undefined,
  ...overrides,
});

describe('ScenarioCache', () => {
  it('returns cached scenario and updates metadata on get', () => {
    const cache = new ScenarioCache(3);
    const scenario = buildScenario({ id: 'a' });

    cache.set('a', scenario);
    const firstStats = cache.getStats();
    expect(firstStats.entries[0]).toMatchObject({ id: 'a', hits: 0 });

    const retrieved = cache.get('a');
    expect(retrieved).toBe(scenario);

    const statsAfterAccess = cache.getStats();
    expect(statsAfterAccess.entries[0].hits).toBe(1);
    expect(statsAfterAccess.entries[0].lastAccess).toBeGreaterThanOrEqual(
      firstStats.entries[0].lastAccess,
    );
  });

  it('evicts least recently used entry when capacity exceeded', () => {
    const cache = new ScenarioCache(2);

    cache.set('a', buildScenario({ id: 'a' }));
    cache.set('b', buildScenario({ id: 'b' }));
    expect(cache.size()).toBe(2);

    // Access "a" so it becomes most recently used
    cache.get('a');

    cache.set('c', buildScenario({ id: 'c' }));

    expect(cache.has('a')).toBe(true);
    expect(cache.has('c')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  it('supports has/delete/clear operations', () => {
    const cache = new ScenarioCache(2);
    cache.set('a', buildScenario({ id: 'a' }));

    expect(cache.has('a')).toBe(true);
    expect(cache.delete('a')).toBe(true);
    expect(cache.has('a')).toBe(false);

    cache.set('b', buildScenario({ id: 'b' }));
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it('exposes stats with capacity and entry summaries', () => {
    const cache = new ScenarioCache(2);
    cache.set('a', buildScenario({ id: 'a' }));

    const stats = cache.getStats();
    expect(stats.capacity).toBe(2);
    expect(stats.size).toBe(1);
    expect(stats.entries).toHaveLength(1);
    expect(stats.entries[0]).toMatchObject({ id: 'a', hits: 0 });
  });

  it('throws when constructed with invalid capacity', () => {
    expect(() => new ScenarioCache(0)).toThrow('ScenarioCache capacity must be a positive finite number.');
    expect(() => new ScenarioCache(Number.POSITIVE_INFINITY)).toThrow(
      'ScenarioCache capacity must be a positive finite number.',
    );
  });
});
