import { Scenario, ScenarioSchema } from '@/game/types';
import { scenarioManifest, type ScenarioResolver } from '@/game/data/scenarioManifest';
import { z } from 'zod';

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

  private readonly loadedScenarios = new Map<string, Scenario>();
  private readonly loadingPromises = new Map<string, Promise<Scenario>>();

  constructor(private readonly manifest: ScenarioManifest = scenarioManifest) {}

  public static getInstance(): ScenarioLoader {
    if (!ScenarioLoader.instance) {
      ScenarioLoader.instance = new ScenarioLoader();
    }
    return ScenarioLoader.instance;
  }

  public async loadScenario(scenarioId: string): Promise<Scenario> {
    if (this.loadedScenarios.has(scenarioId)) {
      return this.loadedScenarios.get(scenarioId)!;
    }

    if (this.loadingPromises.has(scenarioId)) {
      return this.loadingPromises.get(scenarioId)!;
    }

    const promise = this.loadScenarioInternal(scenarioId);
    this.loadingPromises.set(scenarioId, promise);

    try {
      const scenario = await promise;
      this.loadedScenarios.set(scenarioId, scenario);
      return scenario;
    } finally {
      this.loadingPromises.delete(scenarioId);
    }
  }

  public preloadScenario(scenarioId: string): void {
    if (!this.loadedScenarios.has(scenarioId) && !this.loadingPromises.has(scenarioId)) {
      void this.loadScenario(scenarioId);
    }
  }

  public preloadScenarios(scenarioIds: string[]): void {
    scenarioIds.forEach((id) => this.preloadScenario(id));
  }

  public isLoaded(scenarioId: string): boolean {
    return this.loadedScenarios.has(scenarioId);
  }

  public clearCache(): void {
    this.loadedScenarios.clear();
  }

  public getCacheStats(): { loaded: number; loading: number } {
    return {
      loaded: this.loadedScenarios.size,
      loading: this.loadingPromises.size,
    };
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
