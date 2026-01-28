import {
  Condition,
  FlagCondition,
  CounterCondition,
  StatCondition,
  SkillCondition,
  ItemCondition,
  RelationshipCondition,
  LevelCondition,
  LocationCondition,
  TimeCondition,
  AndCondition,
  OrCondition,
  NotCondition,
  ComparisonOperator,
} from '../types/condition';
import { GameState } from '../types/gameState';
import { PlayerCharacter, InventoryItem } from '../types/character';

const DEV_MODE = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export class ConditionEvaluator {
  public static evaluate(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    this.warnIfImpossible(condition);
    const result = this.evaluateCondition(condition, gameState, character);

    if (DEV_MODE) {
      console.debug('[ConditionEvaluator:evaluate]', { condition, result });
    }

    return result;
  }

  public static evaluateAll(
    conditions: Condition[],
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    if (!conditions.length) {
      return true;
    }

    for (const cond of conditions) {
      if (!this.evaluateCondition(cond, gameState, character)) {
        return false;
      }
    }

    return true;
  }

  public static evaluateAny(
    conditions: Condition[],
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    if (!conditions.length) {
      return false;
    }

    for (const cond of conditions) {
      if (this.evaluateCondition(cond, gameState, character)) {
        return true;
      }
    }

    return false;
  }

  public static explainFailure(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter,
  ): string {
    const passed = this.evaluateCondition(condition, gameState, character);

    if (passed) {
      return 'Condition passed';
    }

    switch (condition.type) {
      case 'flag': {
        const value = gameState.flags[condition.target] ?? false;
        return `Flag '${condition.target}' is ${value}, expected ${condition.value}`;
      }
      case 'counter': {
        const value = gameState.counters[condition.target] ?? 0;
        return `Counter '${condition.target}' is ${value}, expected ${condition.operator} ${condition.value}`;
      }
      case 'stat': {
        const value = character.attributes[condition.target];
        return value === undefined
          ? `Stat '${condition.target}' is undefined`
          : `Stat '${condition.target}' is ${value}, expected ${condition.operator} ${condition.value}`;
      }
      case 'skill': {
        const value = character.skills[condition.target];
        return value === undefined
          ? `Skill '${condition.target}' is undefined`
          : `Skill '${condition.target}' is ${value}, expected ${condition.operator} ${condition.value}`;
      }
      case 'item': {
        return `Inventory lacks required item '${condition.target}' (need ${condition.quantity ?? 1}) or it is not equipped`;
      }
      case 'relationship': {
        const value = gameState.relationships[condition.target] ?? 0;
        return `Relationship '${condition.target}' is ${value}, expected ${condition.operator} ${condition.value}`;
      }
      case 'level':
        return `Player level is ${character.level}, expected ${condition.operator} ${condition.value}`;
      case 'location':
        return `Player is at '${gameState.location}', expected '${condition.target}'`;
      case 'time':
        return `Current in-game hour is ${gameState.gameTime.hour}, expected ${condition.operator} ${condition.value}`;
      case 'and': {
        const failed = condition.conditions.find(
          (nested) => !this.evaluateCondition(nested, gameState, character),
        );
        return failed
          ? this.explainFailure(failed, gameState, character)
          : 'AND condition failed, but no failing child identified';
      }
      case 'or':
        return 'None of the OR sub-conditions evaluated to true';
      case 'not':
        return 'Negated condition evaluated to true, so NOT condition failed';
      default:
        return 'Unknown condition type failure';
    }
  }

  private static evaluateCondition(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    switch (condition.type) {
      case 'flag':
        return this.evaluateFlag(condition, gameState);
      case 'counter':
        return this.evaluateCounter(condition, gameState);
      case 'stat':
        return this.evaluateStat(condition, character);
      case 'skill':
        return this.evaluateSkill(condition, character);
      case 'item':
        return this.evaluateItem(condition, character);
      case 'relationship':
        return this.evaluateRelationship(condition, gameState);
      case 'level':
        return this.evaluateLevel(condition, character);
      case 'location':
        return this.evaluateLocation(condition, gameState);
      case 'time':
        return this.evaluateTime(condition, gameState);
      case 'and':
        return this.evaluateAnd(condition, gameState, character);
      case 'or':
        return this.evaluateOr(condition, gameState, character);
      case 'not':
        return this.evaluateNot(condition, gameState, character);
      default:
        if (DEV_MODE) {
          console.warn('[ConditionEvaluator] Unsupported condition type', condition);
        }
        return false;
    }
  }

  private static evaluateFlag(condition: FlagCondition, gameState: GameState): boolean {
    const flagValue = gameState.flags[condition.target];
    return (flagValue ?? false) === condition.value;
  }

  private static evaluateCounter(
    condition: CounterCondition,
    gameState: GameState,
  ): boolean {
    const value = gameState.counters[condition.target];
    return this.compareNumbers(value ?? 0, condition.operator, condition.value);
  }

  private static evaluateStat(condition: StatCondition, character: PlayerCharacter): boolean {
    const statValue = character.attributes[condition.target];

    if (statValue === undefined) {
      if (DEV_MODE) {
        console.warn('[ConditionEvaluator] Unknown stat', condition.target);
      }
      return false;
    }

    return this.compareNumbers(statValue, condition.operator, condition.value);
  }

  private static evaluateSkill(condition: SkillCondition, character: PlayerCharacter): boolean {
    const skillValue = character.skills[condition.target];

    if (skillValue === undefined) {
      if (DEV_MODE) {
        console.warn('[ConditionEvaluator] Unknown skill', condition.target);
      }
      return false;
    }

    return this.compareNumbers(skillValue, condition.operator, condition.value);
  }

  private static evaluateItem(condition: ItemCondition, character: PlayerCharacter): boolean {
    const requiredQuantity = condition.quantity ?? 1;
    const owned = character.inventory
      .filter((item) => item.id === condition.target)
      .reduce((sum, item) => sum + (item.quantity ?? 1), 0);

    if (owned < requiredQuantity) {
      return false;
    }

    if (condition.equipped && !this.isItemEquipped(character.equipment, condition.target)) {
      return false;
    }

    return true;
  }

  private static evaluateRelationship(
    condition: RelationshipCondition,
    gameState: GameState,
  ): boolean {
    const value = gameState.relationships[condition.target];
    return this.compareNumbers(value ?? 0, condition.operator, condition.value);
  }

  private static evaluateLevel(condition: LevelCondition, character: PlayerCharacter): boolean {
    return this.compareNumbers(character.level, condition.operator, condition.value);
  }

  private static evaluateLocation(condition: LocationCondition, gameState: GameState): boolean {
    return gameState.location === condition.target;
  }

  private static evaluateTime(condition: TimeCondition, gameState: GameState): boolean {
    const currentHour = gameState.gameTime.hour;
    return this.compareNumbers(currentHour, condition.operator, condition.value);
  }

  private static evaluateAnd(
    condition: AndCondition,
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    if (!condition.conditions.length) {
      this.warnImpossibleCondition(condition, 'AND condition without nested clauses');
      return true;
    }

    for (const nested of condition.conditions) {
      if (!this.evaluateCondition(nested, gameState, character)) {
        return false;
      }
    }

    return true;
  }

  private static evaluateOr(
    condition: OrCondition,
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    if (!condition.conditions.length) {
      this.warnImpossibleCondition(condition, 'OR condition without nested clauses');
      return false;
    }

    for (const nested of condition.conditions) {
      if (this.evaluateCondition(nested, gameState, character)) {
        return true;
      }
    }

    return false;
  }

  private static evaluateNot(
    condition: NotCondition,
    gameState: GameState,
    character: PlayerCharacter,
  ): boolean {
    return !this.evaluateCondition(condition.condition, gameState, character);
  }

  private static compareNumbers(
    actual: number,
    operator: ComparisonOperator,
    expected: number,
  ): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'not_equals':
        return actual !== expected;
      case 'greater_than':
        return actual > expected;
      case 'less_than':
        return actual < expected;
      case 'greater_equal':
        return actual >= expected;
      case 'less_equal':
        return actual <= expected;
      default:
        if (DEV_MODE) {
          console.warn('[ConditionEvaluator] Unknown comparison operator', operator);
        }
        return false;
    }
  }

  private static isItemEquipped(
    equipment: Record<string, InventoryItem | undefined>,
    target: string,
  ): boolean {
    return Object.values(equipment).some((item) => item?.id === target);
  }

  private static warnIfImpossible(condition: Condition): void {
    if (condition.type === 'item' && (condition.quantity ?? 1) <= 0) {
      this.warnImpossibleCondition(condition, 'Item condition requests non-positive quantity');
    }

    if (condition.type === 'counter' && !Number.isFinite(condition.value)) {
      this.warnImpossibleCondition(condition, 'Counter comparison value is not finite');
    }

    if (condition.type === 'relationship' && (condition.value < -100 || condition.value > 100)) {
      this.warnImpossibleCondition(condition, 'Relationship threshold is outside allowed [-100,100]');
    }
  }

  private static warnImpossibleCondition(condition: Condition, reason: string): void {
    if (DEV_MODE) {
      console.warn('[ConditionEvaluator] Impossible/ill-defined condition detected', {
        condition,
        reason,
      });
    }
  }
}

export const evaluateCondition = (
  condition: Condition,
  gameState: GameState,
  character: PlayerCharacter,
): boolean => ConditionEvaluator.evaluate(condition, gameState, character);

export const evaluateConditions = (
  conditions: Condition[],
  gameState: GameState,
  character: PlayerCharacter,
): boolean => ConditionEvaluator.evaluateAll(conditions, gameState, character);

export const explainConditionFailure = (
  condition: Condition,
  gameState: GameState,
  character: PlayerCharacter,
): string => ConditionEvaluator.explainFailure(condition, gameState, character);
