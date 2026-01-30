import { Scenario } from '@/game/types';
import {
  ScenarioLoader,
  ScenarioLoadError,
  ScenarioNotFoundError,
  ScenarioValidationError,
  clearScenarioCache,
  deleteScenarioFromCache,
  getScenarioCacheStats,
  loadScenario,
  preloadScenario,
  preloadScenarios,
} from '../scenarioLoader';

const buildScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
  id: 'test-scenario',
  titleKey: 'scenarios.test.title',
  textKey: 'scenarios.test.text',
  act: 0,
  scene: 1,
  locationId: 'test-location',
  choices: [],
  prerequisites: [],
  npcsPresent: [],
  metadata: undefined,
  ...overrides,
});

const flushMicrotasks = () => new Promise((resolve) => setImmediate(resolve));

const createScenarioDeferred = () => {
  let resolve!: (value: Scenario) => void;
  const promise = new Promise<Scenario>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

describe('ScenarioLoader', () => {
  it('loads and caches scenarios from manifest', async () => {
    const manifest = {
      'test-scenario': jest.fn(async () => buildScenario()),
    };
    const loader = new ScenarioLoader(manifest);

    const first = await loader.loadScenario('test-scenario');
    const second = await loader.loadScenario('test-scenario');

    expect(first).toBe(second);
    expect(manifest['test-scenario']).toHaveBeenCalledTimes(1);
    expect(loader.isLoaded('test-scenario')).toBe(true);

    loader.clearCache();
    expect(loader.isLoaded('test-scenario')).toBe(false);
  });

  it('throws ScenarioNotFoundError for unknown scenarios', async () => {
    const loader = new ScenarioLoader({});

    await expect(loader.loadScenario('missing')).rejects.toBeInstanceOf(ScenarioNotFoundError);
  });

  it('throws ScenarioValidationError when schema fails', async () => {
    const manifest = {
      'invalid-scenario': async () => ({}) as Scenario,
    };
    const loader = new ScenarioLoader(manifest);

    await expect(loader.loadScenario('invalid-scenario')).rejects.toBeInstanceOf(
      ScenarioValidationError,
    );
  });

  it('wraps unexpected errors in ScenarioLoadError', async () => {
    const manifest = {
      'error-scenario': async () => {
        throw new Error('boom');
      },
    };
    const loader = new ScenarioLoader(manifest);

    await expect(loader.loadScenario('error-scenario')).rejects.toBeInstanceOf(ScenarioLoadError);
  });

  it('deduplicates concurrent loads', async () => {
    const { promise: deferred, resolve } = createScenarioDeferred();
    const manifest = {
      'test-scenario': jest.fn(() => deferred),
    };
    const loader = new ScenarioLoader(manifest);

    const promise1 = loader.loadScenario('test-scenario');
    const promise2 = loader.loadScenario('test-scenario');

    resolve(buildScenario());
    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toBe(result2);
    expect(manifest['test-scenario']).toHaveBeenCalledTimes(1);
  });

  it('preloads scenarios without awaiting promise', async () => {
    const manifest = {
      'preload-scenario': jest.fn(async () => buildScenario({ id: 'preload-scenario' })),
    };
    const loader = new ScenarioLoader(manifest);

    loader.preloadScenario('preload-scenario');
    await flushMicrotasks();

    expect(loader.isLoaded('preload-scenario')).toBe(true);
    expect(manifest['preload-scenario']).toHaveBeenCalledTimes(1);
  });

  it('preloads multiple scenarios via preloadScenarios helper', async () => {
    const manifest = {
      a: jest.fn(async () => buildScenario({ id: 'a' })),
      b: jest.fn(async () => buildScenario({ id: 'b' })),
    };
    const loader = new ScenarioLoader(manifest);

    loader.preloadScenarios(['a', 'b']);
    await flushMicrotasks();

    expect(loader.isLoaded('a')).toBe(true);
    expect(loader.isLoaded('b')).toBe(true);
    expect(manifest.a).toHaveBeenCalledTimes(1);
    expect(manifest.b).toHaveBeenCalledTimes(1);
  });

  it('skips preload when scenario already cached', async () => {
    const manifest = {
      cached: jest.fn(async () => buildScenario({ id: 'cached' })),
    };
    const loader = new ScenarioLoader(manifest);

    await loader.loadScenario('cached');
    loader.preloadScenario('cached');
    await flushMicrotasks();

    expect(manifest.cached).toHaveBeenCalledTimes(1);
  });

  it('deduplicates preload while load in progress', async () => {
    const { promise: deferred, resolve } = createScenarioDeferred();
    const manifest = {
      pending: jest.fn(() => deferred),
    };
    const loader = new ScenarioLoader(manifest);

    const loadPromise = loader.loadScenario('pending');
    loader.preloadScenario('pending');
    resolve(buildScenario({ id: 'pending' }));
    await loadPromise;

    expect(manifest.pending).toHaveBeenCalledTimes(1);
  });

  it('preloadScenarios handles duplicate ids gracefully', async () => {
    const manifest = {
      dup: jest.fn(async () => buildScenario({ id: 'dup' })),
    };
    const loader = new ScenarioLoader(manifest);

    loader.preloadScenarios(['dup', 'dup']);
    await flushMicrotasks();

    expect(loader.isLoaded('dup')).toBe(true);
    expect(manifest.dup).toHaveBeenCalledTimes(1);
  });

  it('shares singleton instance cache across getInstance calls', async () => {
    const instanceA = ScenarioLoader.getInstance();
    instanceA.clearCache();
    const instanceB = ScenarioLoader.getInstance();

    expect(instanceA).toBe(instanceB);
    await instanceA.loadScenario('test-scenario-1');

    expect(instanceB.isLoaded('test-scenario-1')).toBe(true);
    instanceA.clearCache();
  });

  it('reports cache statistics and clears cache correctly', async () => {
    const manifest = {
      'stats-scenario': jest.fn(async () => buildScenario({ id: 'stats-scenario' })),
    };
    const loader = new ScenarioLoader(manifest);

    loader.preloadScenario('stats-scenario');
    expect(loader.getCacheStats()).toMatchObject({ loaded: 0, loading: 1 });
    await loader.loadScenario('stats-scenario');
    const statsAfterLoad = loader.getCacheStats();
    expect(statsAfterLoad.loaded).toBe(1);
    expect(statsAfterLoad.loading).toBe(0);
    expect(statsAfterLoad.capacity).toBeGreaterThan(0);
    expect(statsAfterLoad.entries).toHaveLength(1);

    loader.clearCache();
    expect(loader.getCacheStats()).toMatchObject({ loaded: 0, loading: 0 });
    expect(loader.isLoaded('stats-scenario')).toBe(false);
  });

  it('supports custom manifests (dependency injection)', async () => {
    const customManifest = {
      'custom-scenario': jest.fn(async () => buildScenario({ id: 'custom-scenario' })),
    };
    const loader = new ScenarioLoader(customManifest);
    const scenario = await loader.loadScenario('custom-scenario');

    expect(scenario.id).toBe('custom-scenario');
    expect(customManifest['custom-scenario']).toHaveBeenCalledTimes(1);
  });

  it('delegates helper exports to the singleton instance', async () => {
    const mockInstance = {
      loadScenario: jest.fn().mockResolvedValue(buildScenario()),
      preloadScenario: jest.fn(),
      preloadScenarios: jest.fn(),
      clearCache: jest.fn(),
      getCacheStats: jest.fn().mockReturnValue({ loaded: 0, loading: 0, capacity: 5, entries: [] }),
      deleteFromCache: jest.fn().mockReturnValue(true),
    } as unknown as ScenarioLoader;

    const getInstanceSpy = jest.spyOn(ScenarioLoader, 'getInstance').mockReturnValue(mockInstance);

    await loadScenario('alpha');
    expect(mockInstance.loadScenario).toHaveBeenCalledWith('alpha');

    preloadScenario('beta');
    expect(mockInstance.preloadScenario).toHaveBeenCalledWith('beta');

    preloadScenarios(['gamma']);
    expect(mockInstance.preloadScenarios).toHaveBeenCalledWith(['gamma']);

    clearScenarioCache();
    expect(mockInstance.clearCache).toHaveBeenCalledTimes(1);

    getScenarioCacheStats();
    expect(mockInstance.getCacheStats).toHaveBeenCalledTimes(1);

    deleteScenarioFromCache('delta');
    expect(mockInstance.deleteFromCache).toHaveBeenCalledWith('delta');

    getInstanceSpy.mockRestore();
  });
});
