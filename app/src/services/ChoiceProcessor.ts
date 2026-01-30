import { ConditionEvaluator } from '@/game/services/ConditionEvaluator';
import { ConsequenceApplicator, type ConsequenceEvent } from '@/game/services/ConsequenceApplicator';
import type { Consequence } from '@/game/types/consequence';
import type { GameState, ScenarioHistoryEntry } from '@/game/types/gameState';
import type { PlayerCharacter, CharacterAttributeMap } from '@/game/types/character';
import type { Choice, Scenario } from '@/game/types/scenario';
import { performSkillCheck, type SkillCheckResult, type SkillType } from '@/game/types/skillCheck';
import { ScenarioLoader } from './scenarioLoader';

export class ChoiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChoiceUnavailableError';
  }
}

export class ChoiceProcessingError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'ChoiceProcessingError';
  }
}

export type ChoiceProcessorResult =
  | {
      type: 'success';
      nextScenario: Scenario;
      skillCheckResult?: SkillCheckResult;
      events: ConsequenceEvent[];
      warnings: string[];
    }
  | {
      type: 'death';
      skillCheckResult?: SkillCheckResult;
      events: ConsequenceEvent[];
      warnings: string[];
    };

const SKILL_ATTRIBUTE_MAP: Partial<Record<SkillType, keyof CharacterAttributeMap>> = {
  persuasion: 'charisma',
  intimidation: 'strength',
  deception: 'charisma',
  insight: 'wisdom',
  perception: 'wisdom',
  investigation: 'intelligence',
  stealth: 'agility',
  sleight_of_hand: 'agility',
  athletics: 'strength',
  acrobatics: 'agility',
  medicine: 'wisdom',
  herbalism: 'wisdom',
  arcana: 'intelligence',
  history: 'intelligence',
  religion: 'intelligence',
  survival: 'wisdom',
};

export class ChoiceProcessor {
  public static async processChoice(
    choice: Choice,
    scenario: Scenario,
    gameState: GameState,
    character: PlayerCharacter,
  ): Promise<ChoiceProcessorResult> {
    this.assertChoiceAvailable(choice, gameState, character);

    const { success, skillCheckResult } = this.resolveSkillCheck(choice, character);
    const consequences = this.resolveConsequences(choice, success);

    const applyResult = await ConsequenceApplicator.apply(consequences, gameState, character);

    if (!applyResult.success) {
      throw new ChoiceProcessingError('Failed to apply consequences', applyResult.error);
    }

    this.appendHistoryEntry(gameState, scenario, choice, skillCheckResult);

    if (character.health <= 0) {
      return {
        type: 'death',
        skillCheckResult,
        events: applyResult.events,
        warnings: applyResult.warnings,
      };
    }

    const nextScenario = await this.loadNextScenario(choice, success);
    gameState.currentScenario = nextScenario;

    return {
      type: 'success',
      nextScenario,
      skillCheckResult,
      events: applyResult.events,
      warnings: applyResult.warnings,
    };
  }

  private static assertChoiceAvailable(
    choice: Choice,
    gameState: GameState,
    character: PlayerCharacter,
  ): void {
    const available = ConditionEvaluator.evaluateAll(choice.conditions ?? [], gameState, character);

    if (!available) {
      throw new ChoiceUnavailableError(`Choice '${choice.id}' is not currently available.`);
    }
  }

  private static resolveSkillCheck(choice: Choice, character: PlayerCharacter): {
    success: boolean;
    skillCheckResult?: SkillCheckResult;
  } {
    if (!choice.skillCheck) {
      return { success: true };
    }

    const skillLevel = character.skills[choice.skillCheck.skill] ?? 0;
    const attributeBonus = this.getAttributeBonus(choice.skillCheck.skill, character.attributes);
    const skillCheckResult = performSkillCheck(choice.skillCheck, skillLevel, attributeBonus);

    return { success: skillCheckResult.success, skillCheckResult };
  }

  private static getAttributeBonus(skill: SkillType, attributes: CharacterAttributeMap): number {
    const attributeKey = SKILL_ATTRIBUTE_MAP[skill] ?? 'intelligence';
    const value = attributes[attributeKey] ?? 10;
    return Math.floor((value - 10) / 2);
  }

  private static resolveConsequences(choice: Choice, success: boolean): Consequence[] {
    if (success) {
      return choice.consequences;
    }

    return choice.failureConsequences ?? [];
  }

  private static appendHistoryEntry(
    gameState: GameState,
    scenario: Scenario,
    choice: Choice,
    skillCheckResult?: SkillCheckResult,
  ): void {
    const entry: ScenarioHistoryEntry = {
      scenarioId: scenario.id,
      choiceId: choice.id,
      timestamp: Date.now(),
    };

    if (skillCheckResult) {
      entry.skillCheckResult = skillCheckResult;
    }

    gameState.scenarioHistory = [...gameState.scenarioHistory, entry];
  }

  private static async loadNextScenario(choice: Choice, success: boolean): Promise<Scenario> {
    const nextScenarioId = success
      ? choice.nextScenario
      : choice.nextScenarioOnFailure ?? choice.nextScenario;

    if (!nextScenarioId) {
      throw new ChoiceProcessingError(
        `Choice '${choice.id}' does not define a next scenario for the current outcome.`,
      );
    }

    return ScenarioLoader.getInstance().loadScenario(nextScenarioId);
  }
}
