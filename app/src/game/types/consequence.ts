import { z } from 'zod';

/** Supported consequence discriminators. */
export const ConsequenceTypeValues = [
  'flag',
  'counter',
  'stat',
  'skill',
  'item',
  'experience',
  'health',
  'mana',
  'gold',
  'relationship',
  'unlock_shop',
  'unlock_dialogue',
  'unlock_quest',
  'unlock_location',
  'trigger_event',
  'set_location',
] as const;

export type ConsequenceType = (typeof ConsequenceTypeValues)[number];

export type NumericAdjustmentAction = 'set' | 'increase' | 'decrease';
export type CounterAction = 'set' | 'increment' | 'decrement';
export type ItemAction = 'add' | 'remove';

export interface BaseConsequence {
  type: ConsequenceType;
  description?: string;
}

export interface FlagConsequence extends BaseConsequence {
  type: 'flag';
  target: string;
  value: boolean;
}

export interface CounterConsequence extends BaseConsequence {
  type: 'counter';
  target: string;
  action: CounterAction;
  value: number;
}

export interface StatConsequence extends BaseConsequence {
  type: 'stat';
  target: string;
  action: NumericAdjustmentAction;
  value: number;
}

export interface SkillConsequence extends BaseConsequence {
  type: 'skill';
  target: string;
  action: NumericAdjustmentAction;
  value: number;
}

export interface ItemConsequence extends BaseConsequence {
  type: 'item';
  target: string;
  action: ItemAction;
  quantity?: number;
  autoEquip?: boolean;
}

export interface ExperienceConsequence extends BaseConsequence {
  type: 'experience';
  value: number;
}

export interface HealthConsequence extends BaseConsequence {
  type: 'health';
  value: number;
  canKill?: boolean;
}

export interface ManaConsequence extends BaseConsequence {
  type: 'mana';
  value: number;
}

export interface GoldConsequence extends BaseConsequence {
  type: 'gold';
  value: number;
}

export interface RelationshipConsequence extends BaseConsequence {
  type: 'relationship';
  target: string;
  value: number;
}

export interface UnlockShopConsequence extends BaseConsequence {
  type: 'unlock_shop';
  target: string;
}

export interface UnlockDialogueConsequence extends BaseConsequence {
  type: 'unlock_dialogue';
  target: string;
}

export interface UnlockQuestConsequence extends BaseConsequence {
  type: 'unlock_quest';
  target: string;
  autoStart?: boolean;
}

export interface UnlockLocationConsequence extends BaseConsequence {
  type: 'unlock_location';
  target: string;
}

export interface TriggerEventConsequence extends BaseConsequence {
  type: 'trigger_event';
  target: string;
  data?: Record<string, unknown>;
}

export interface SetLocationConsequence extends BaseConsequence {
  type: 'set_location';
  target: string;
}

export type Consequence =
  | FlagConsequence
  | CounterConsequence
  | StatConsequence
  | SkillConsequence
  | ItemConsequence
  | ExperienceConsequence
  | HealthConsequence
  | ManaConsequence
  | GoldConsequence
  | RelationshipConsequence
  | UnlockShopConsequence
  | UnlockDialogueConsequence
  | UnlockQuestConsequence
  | UnlockLocationConsequence
  | TriggerEventConsequence
  | SetLocationConsequence;

const NumericAdjustmentSchema = z.enum(['set', 'increase', 'decrease']);
const CounterActionSchema = z.enum(['set', 'increment', 'decrement']);
const ItemActionSchema = z.enum(['add', 'remove']);

export const ConsequenceSchema: z.ZodType<Consequence> = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('flag'),
    target: z.string(),
    value: z.boolean(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('counter'),
    target: z.string(),
    action: CounterActionSchema,
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('stat'),
    target: z.string(),
    action: NumericAdjustmentSchema,
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('skill'),
    target: z.string(),
    action: NumericAdjustmentSchema,
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('item'),
    target: z.string(),
    action: ItemActionSchema,
    quantity: z.number().optional(),
    autoEquip: z.boolean().optional(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('experience'),
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('health'),
    value: z.number(),
    canKill: z.boolean().optional(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('mana'),
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('gold'),
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('relationship'),
    target: z.string(),
    value: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('unlock_shop'),
    target: z.string(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('unlock_dialogue'),
    target: z.string(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('unlock_quest'),
    target: z.string(),
    autoStart: z.boolean().optional(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('unlock_location'),
    target: z.string(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('trigger_event'),
    target: z.string(),
    data: z.record(z.unknown()).optional(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('set_location'),
    target: z.string(),
    description: z.string().optional(),
  }),
]);

export const isConsequence = (value: unknown): value is Consequence =>
  ConsequenceSchema.safeParse(value).success;
