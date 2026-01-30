import { Scenario, ScenarioSchema } from '@/game/types';
import { scenarioManifest, type ScenarioResolver } from '@/game/data/scenarioManifest';
import { z } from 'zod';
import { ScenarioCache, type ScenarioCacheEntrySummary } from './ScenarioCache';

export class ScenarioNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioNotFoundError';
  }
}

export class ScenarioValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioValidationError';
  }
}

export class ScenarioLoadError extends Error {
  public readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'ScenarioLoadError';
    this.originalError = originalError;
  }
}

export type ScenarioManifest = Record<string, ScenarioResolver>;

export class ScenarioLoader {
  private static instance: ScenarioLoader | null = null;

  private readonly cache: ScenarioCache;
  private readonly loadingPromises = new Map<string, Promise<Scenario>>();

  constructor(
    private readonly manifest: ScenarioManifest = scenarioManifest,
    cache: ScenarioCache = new ScenarioCache(),
  ) {
    this.cache = cache;
  }

  public static getInstance(): ScenarioLoader {
    if (!ScenarioLoader.instance) {
      ScenarioLoader.instance = new ScenarioLoader();
    }
    return ScenarioLoader.instance;
  }

  public async loadScenario(scenarioId: string): Promise<Scenario> {
    const cachedScenario = this.cache.get(scenarioId);
    if (cachedScenario) {
      return cachedScenario;
    }

    if (this.loadingPromises.has(scenarioId)) {
      return this.loadingPromises.get(scenarioId)!;
    }

    const loadPromise = this.loadScenarioInternal(scenarioId)
      .then((scenario) => {
        this.cache.set(scenarioId, scenario);
        return scenario;
      })
      .finally(() => {
        this.loadingPromises.delete(scenarioId);
      });

    this.loadingPromises.set(scenarioId, loadPromise);

    return loadPromise;
  }

  public preloadScenario(scenarioId: string): void {
    if (!this.cache.has(scenarioId) && !this.loadingPromises.has(scenarioId)) {
      void this.loadScenario(scenarioId);
    }
  }

  public preloadScenarios(scenarioIds: string[]): void {
    scenarioIds.forEach((id) => this.preloadScenario(id));
  }

  public isLoaded(scenarioId: string): boolean {
    return this.cache.has(scenarioId);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): {
    loaded: number;
    loading: number;
    capacity: number;
    entries: ScenarioCacheEntrySummary[];
  } {
    const stats = this.cache.getStats();
    return {
      loaded: stats.size,
      loading: this.loadingPromises.size,
      capacity: stats.capacity,
      entries: stats.entries,
    };
  }

  public deleteFromCache(scenarioId: string): boolean {
    return this.cache.delete(scenarioId);
  }

  private async loadScenarioInternal(scenarioId: string): Promise<Scenario> {
    const resolver = this.manifest[scenarioId];
    if (!resolver) {
      throw new ScenarioNotFoundError(`Scenario with id "${scenarioId}" is not registered.`);
    }

    try {
      const data = await resolver();
      return ScenarioSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues
          .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
          .join('; ');
        throw new ScenarioValidationError(`Scenario ${scenarioId} failed validation: ${issues}`);
      }
      if (error instanceof ScenarioNotFoundError || error instanceof ScenarioValidationError) {
        throw error;
      }
      throw new ScenarioLoadError(`Scenario ${scenarioId} failed to load`, error as Error);
    }
  }
}

export const loadScenario = (scenarioId: string) => ScenarioLoader.getInstance().loadScenario(scenarioId);
export const preloadScenario = (scenarioId: string) => ScenarioLoader.getInstance().preloadScenario(scenarioId);
export const preloadScenarios = (scenarioIds: string[]) =>
  ScenarioLoader.getInstance().preloadScenarios(scenarioIds);
export const clearScenarioCache = () => ScenarioLoader.getInstance().clearCache();
export const getScenarioCacheStats = () => ScenarioLoader.getInstance().getCacheStats();
export const deleteScenarioFromCache = (scenarioId: string) =>
  ScenarioLoader.getInstance().deleteFromCache(scenarioId);
