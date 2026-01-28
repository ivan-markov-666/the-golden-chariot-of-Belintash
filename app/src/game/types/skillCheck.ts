import { z } from 'zod';

/** List of supported character skills referenced across scenarios. */
export const SkillTypeValues = [
  'persuasion',
  'intimidation',
  'deception',
  'insight',
  'perception',
  'investigation',
  'stealth',
  'sleight_of_hand',
  'athletics',
  'acrobatics',
  'medicine',
  'herbalism',
  'arcana',
  'history',
  'religion',
  'survival',
] as const;

export type SkillType = (typeof SkillTypeValues)[number];

/** Difficulty tiers for quick authoring. */
export type DifficultyTier = 'trivial' | 'easy' | 'standard' | 'hard' | 'heroic';

/**
 * Definition of a skill check embedded inside choices.
 */
export interface SkillCheck {
  /** Which skill is being compared. */
  skill: SkillType;
  /** Difficulty class (DC) to beat via d20 + modifiers. */
  dc: number;
  /** Optional named tier for analytics. */
  difficultyTier?: DifficultyTier;
  /** Minimum roll required regardless of modifiers (e.g., trap detection). */
  minRoll?: number;
  /** Maximum roll allowed (for cursed interactions). */
  maxRoll?: number;
}

/**
 * Result returned by engine when evaluating a skill check.
 */
export interface SkillCheckResult {
  success: boolean;
  roll: number;
  modifier: number;
  total: number;
  dc: number;
  criticalSuccess: boolean;
  criticalFailure: boolean;
  margin: number;
}

const SkillTypeSchema = z.enum(SkillTypeValues);
const DifficultyTierSchema = z.enum(['trivial', 'easy', 'standard', 'hard', 'heroic']);

export const SkillCheckSchema: z.ZodType<SkillCheck> = z.object({
  skill: SkillTypeSchema,
  dc: z.number().min(1),
  difficultyTier: DifficultyTierSchema.optional(),
  minRoll: z.number().min(1).max(20).optional(),
  maxRoll: z.number().min(1).max(20).optional(),
});

export const SkillCheckResultSchema: z.ZodType<SkillCheckResult> = z.object({
  success: z.boolean(),
  roll: z.number().min(1).max(20),
  modifier: z.number(),
  total: z.number(),
  dc: z.number(),
  criticalSuccess: z.boolean(),
  criticalFailure: z.boolean(),
  margin: z.number(),
});

export const isSkillCheck = (value: unknown): value is SkillCheck =>
  SkillCheckSchema.safeParse(value).success;

/**
 * Performs a d20 skill check with optional minimum/maximum roll overrides.
 */
export const performSkillCheck = (
  skillCheck: SkillCheck,
  skillLevel: number,
  attributeBonus: number,
): SkillCheckResult => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const constrainedRoll = Math.min(
    Math.max(roll, skillCheck.minRoll ?? 1),
    skillCheck.maxRoll ?? 20,
  );
  const modifier = Math.floor(skillLevel / 10) + attributeBonus;
  const total = constrainedRoll + modifier;
  const criticalSuccess = constrainedRoll === 20;
  const criticalFailure = constrainedRoll === 1;
  const success = criticalSuccess
    ? true
    : criticalFailure
      ? false
      : total >= skillCheck.dc;

  return {
    success,
    roll: constrainedRoll,
    modifier,
    total,
    dc: skillCheck.dc,
    criticalSuccess,
    criticalFailure,
    margin: total - skillCheck.dc,
  };
};
