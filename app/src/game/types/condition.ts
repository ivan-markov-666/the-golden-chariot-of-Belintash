import { z } from 'zod';

/**
 * Enumerates all supported condition discriminators.
 */
export const ConditionTypeValues = [
  'flag',
  'counter',
  'stat',
  'skill',
  'item',
  'relationship',
  'level',
  'location',
  'time',
  'and',
  'or',
  'not',
] as const;

export type ConditionType = (typeof ConditionTypeValues)[number];

/** Comparison operators applied to numeric values. */
export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal';

/**
 * Base shape shared across every condition.
 */
export interface BaseCondition {
  /** Discriminator describing which specific condition is encoded. */
  type: ConditionType;
  /** Optional human readable description for debugging. */
  description?: string;
}

export interface FlagCondition extends BaseCondition {
  type: 'flag';
  target: string;
  value: boolean;
}

export interface CounterCondition extends BaseCondition {
  type: 'counter';
  target: string;
  operator: ComparisonOperator;
  value: number;
}

export interface StatCondition extends BaseCondition {
  type: 'stat';
  target: string;
  operator: ComparisonOperator;
  value: number;
}

export interface SkillCondition extends BaseCondition {
  type: 'skill';
  target: string;
  operator: ComparisonOperator;
  value: number;
}

export interface ItemCondition extends BaseCondition {
  type: 'item';
  target: string;
  quantity?: number;
  equipped?: boolean;
}

export interface RelationshipCondition extends BaseCondition {
  type: 'relationship';
  target: string;
  operator: ComparisonOperator;
  value: number;
}

export interface LevelCondition extends BaseCondition {
  type: 'level';
  operator: ComparisonOperator;
  value: number;
}

export interface LocationCondition extends BaseCondition {
  type: 'location';
  target: string;
}

export interface TimeCondition extends BaseCondition {
  type: 'time';
  operator: ComparisonOperator;
  value: number;
}

export interface AndCondition extends BaseCondition {
  type: 'and';
  conditions: Condition[];
}

export interface OrCondition extends BaseCondition {
  type: 'or';
  conditions: Condition[];
}

export interface NotCondition extends BaseCondition {
  type: 'not';
  condition: Condition;
}

/**
 * Union of every supported condition variant.
 */
export type Condition =
  | FlagCondition
  | CounterCondition
  | StatCondition
  | SkillCondition
  | ItemCondition
  | RelationshipCondition
  | LevelCondition
  | LocationCondition
  | TimeCondition
  | AndCondition
  | OrCondition
  | NotCondition;

const ComparisonOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
]);

const conditionDiscriminators = z.enum(ConditionTypeValues);

/**
 * Zod schema describing the Condition union. Exported for runtime validation.
 */
export const ConditionSchema: z.ZodType<Condition> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('flag'),
      target: z.string(),
      value: z.boolean(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('counter'),
      target: z.string(),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('stat'),
      target: z.string(),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('skill'),
      target: z.string(),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('item'),
      target: z.string(),
      quantity: z.number().optional(),
      equipped: z.boolean().optional(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('relationship'),
      target: z.string(),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('level'),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('location'),
      target: z.string(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('time'),
      operator: ComparisonOperatorSchema,
      value: z.number(),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('and'),
      conditions: z.array(ConditionSchema),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('or'),
      conditions: z.array(ConditionSchema),
      description: z.string().optional(),
    }),
    z.object({
      type: z.literal('not'),
      condition: ConditionSchema,
      description: z.string().optional(),
    }),
  ]),
);

/**
 * Runtime helper that narrows unknown values to Condition.
 */
export const isCondition = (value: unknown): value is Condition =>
  ConditionSchema.safeParse(value).success;

/**
 * Helper that checks if the discriminator is valid without parsing the full shape.
 */
export const isConditionType = (value: unknown): value is ConditionType =>
  typeof value === 'string' && conditionDiscriminators.safeParse(value).success;
