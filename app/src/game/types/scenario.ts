import { z } from 'zod';
import { Condition, ConditionSchema } from './condition';
import { Consequence, ConsequenceSchema } from './consequence';
import { SkillCheck, SkillCheckSchema } from './skillCheck';

/**
 * Metadata describing authoring details for a scenario.
 */
export interface ScenarioMetadata {
  author?: string;
  createdDate?: string;
  tags?: string[];
  notes?: string;
}

/**
 * Describes a single choice the player can select.
 */
export interface Choice {
  id: string;
  textKey: string;
  conditions: Condition[];
  skillCheck?: SkillCheck;
  consequences: Consequence[];
  nextScenario: string;
  nextScenarioOnFailure?: string;
}

/**
 * Scenario is the basic narrative building block in the engine.
 */
export interface Scenario {
  id: string;
  titleKey: string;
  textKey: string;
  act: number;
  scene: number;
  locationId: string;
  choices: Choice[];
  prerequisites: Condition[];
  npcsPresent: string[];
  metadata?: ScenarioMetadata;
}

/** Zod schema for metadata block. */
const ScenarioMetadataSchema: z.ZodType<ScenarioMetadata> = z.object({
  author: z.string().optional(),
  createdDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/** Zod schema for Choice definitions. */
export const ChoiceSchema: z.ZodType<Choice> = z.object({
  id: z.string(),
  textKey: z.string(),
  conditions: z.array(ConditionSchema),
  skillCheck: SkillCheckSchema.optional(),
  consequences: z.array(ConsequenceSchema),
  nextScenario: z.string(),
  nextScenarioOnFailure: z.string().optional(),
});

/** Zod schema for Scenario definitions. */
export const ScenarioSchema: z.ZodType<Scenario> = z.object({
  id: z.string(),
  titleKey: z.string(),
  textKey: z.string(),
  act: z.number().nonnegative(),
  scene: z.number().nonnegative(),
  locationId: z.string(),
  choices: z.array(ChoiceSchema),
  prerequisites: z.array(ConditionSchema),
  npcsPresent: z.array(z.string()),
  metadata: ScenarioMetadataSchema.optional(),
});

export const isScenario = (value: unknown): value is Scenario =>
  ScenarioSchema.safeParse(value).success;

export const isChoice = (value: unknown): value is Choice =>
  ChoiceSchema.safeParse(value).success;
