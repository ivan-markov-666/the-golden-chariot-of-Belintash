import type { Scenario } from '@/game/types';
import testScenario1 from './scenarios/test-scenario-1.json';
import invalidScenario from './scenarios/invalid-scenario.json';

export type ScenarioResolver = () => Promise<Scenario>;

/**
 * Static map of scenario IDs to asynchronous resolver functions.
 * Additional scenarios should be appended here until a build-time manifest is generated.
 */
export const scenarioManifest: Record<string, ScenarioResolver> = {
  'test-scenario-1': async () => testScenario1 as unknown as Scenario,
  'invalid-scenario': async () => invalidScenario as unknown as Scenario,
};
