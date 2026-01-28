import { z } from 'zod';
import { Scenario, ScenarioSchema } from './scenario';

export interface ScenarioHistoryEntry {
  scenarioId: string;
  choiceId?: string;
  timestamp: number;
  skillCheckResult?: {
    skill: string;
    success: boolean;
    roll: number;
    total: number;
  };
}

export interface GameTime {
  day: number;
  hour: number;
  period: 'night' | 'morning' | 'afternoon' | 'evening';
}

export interface GameStateMetadata {
  createdAt: number;
  updatedAt: number;
  version: string;
  contentVersion: string;
  playtime: number;
}

/**
 * Snapshot of every persisted system in the story engine.
 */
export interface GameState {
  currentScenario: Scenario | null;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  location: string;
  relationships: Record<string, number>;
  unlockedShops: string[];
  unlockedDialogues: string[];
  unlockedQuests: string[];
  unlockedLocations: string[];
  dialogueHistory: string[];
  scenarioHistory: ScenarioHistoryEntry[];
  gameTime: GameTime;
  metadata: GameStateMetadata;
}

const ScenarioHistoryEntrySchema: z.ZodType<ScenarioHistoryEntry> = z.object({
  scenarioId: z.string(),
  choiceId: z.string().optional(),
  timestamp: z.number(),
  skillCheckResult: z
    .object({
      skill: z.string(),
      success: z.boolean(),
      roll: z.number(),
      total: z.number(),
    })
    .optional(),
});

const GameTimeSchema: z.ZodType<GameTime> = z.object({
  day: z.number().nonnegative(),
  hour: z.number().min(0).max(23),
  period: z.enum(['night', 'morning', 'afternoon', 'evening']),
});

const GameStateMetadataSchema: z.ZodType<GameStateMetadata> = z.object({
  createdAt: z.number(),
  updatedAt: z.number(),
  version: z.string(),
  contentVersion: z.string(),
  playtime: z.number(),
});

export const GameStateSchema: z.ZodType<GameState> = z.object({
  currentScenario: ScenarioSchema.nullable(),
  flags: z.record(z.boolean()),
  counters: z.record(z.number()),
  location: z.string(),
  relationships: z.record(z.number()),
  unlockedShops: z.array(z.string()),
  unlockedDialogues: z.array(z.string()),
  unlockedQuests: z.array(z.string()),
  unlockedLocations: z.array(z.string()),
  dialogueHistory: z.array(z.string()),
  scenarioHistory: z.array(ScenarioHistoryEntrySchema),
  gameTime: GameTimeSchema,
  metadata: GameStateMetadataSchema,
});

export const createInitialGameState = (): GameState => ({
  currentScenario: null,
  flags: {},
  counters: {},
  location: 'kamenitsa_home',
  relationships: {},
  unlockedShops: [],
  unlockedDialogues: [],
  unlockedQuests: [],
  unlockedLocations: ['kamenitsa_home', 'kamenitsa'],
  dialogueHistory: [],
  scenarioHistory: [],
  gameTime: { day: 1, hour: 6, period: 'morning' },
  metadata: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: '1.0.0',
    contentVersion: '1.0.0',
    playtime: 0,
  },
});

export const isGameState = (value: unknown): value is GameState =>
  GameStateSchema.safeParse(value).success;
