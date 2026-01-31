import {
  GameState,
  RelationshipInteraction,
  RelationshipProfile,
} from '../types/gameState';

export type RelationshipLevel = 'enemy' | 'unfriendly' | 'neutral' | 'friendly' | 'close';

const MIN_AFFINITY = -100;
const MAX_AFFINITY = 100;
const DAILY_DECAY = 0.5;

export interface RelationshipInteractionContext {
  reason?: string;
  location?: string;
  timestamp?: number;
}

export class RelationshipService {
  /**
   * Изчислява нивото на отношение спрямо дефинираните прагове.
   */
  public static getRelationshipLevel(affinity: number): RelationshipLevel {
    if (affinity <= -50) return 'enemy';
    if (affinity <= -10) return 'unfriendly';
    if (affinity <= 10) return 'neutral';
    if (affinity <= 50) return 'friendly';
    return 'close';
  }

  /**
   * Прилага дневен decay към афинитета (дрейф към неутрално) и след това добавя делтата.
   */
  public static adjustWithDecay(
    currentAffinity: number,
    delta: number,
    daysSinceLastInteraction: number,
  ): number {
    const safeDays = Number.isFinite(daysSinceLastInteraction) ? Math.max(0, daysSinceLastInteraction) : 0;
    const decayAmount = safeDays * DAILY_DECAY;

    let affinityAfterDecay = currentAffinity;

    if (currentAffinity > 0) {
      affinityAfterDecay = Math.max(0, currentAffinity - decayAmount);
    } else if (currentAffinity < 0) {
      affinityAfterDecay = Math.min(0, currentAffinity + decayAmount);
    }

    const adjusted = affinityAfterDecay + delta;
    return clampAffinity(adjusted);
  }

  /**
   * Проверява дали дадено изискване за отношение е изпълнено.
   */
  public static meetsRelationshipRequirement(npcId: string, required: number, gameState: GameState): boolean {
    const affinity = gameState.relationships[npcId] ?? 0;
    return affinity >= required;
  }

  /**
   * Прилага делта към отношение, отчита decay и записва history/metadata.
   * Връща новата стойност на афинитета.
   */
  public static applyDelta(
    gameState: GameState,
    npcId: string,
    delta: number,
    currentDay: number,
    context: RelationshipInteractionContext = {},
  ): number {
    const profile = this.getOrCreateProfile(gameState, npcId);
    const currentAffinity = gameState.relationships[npcId] ?? 0;
    const daysSince = this.getDaysSinceLastInteraction(profile.lastInteractionDay, currentDay);
    const newAffinity = this.adjustWithDecay(currentAffinity, delta, daysSince);

    gameState.relationships[npcId] = newAffinity;
    gameState.relationshipMetadata[npcId] = this.recordInteraction(profile, {
      timestamp: context.timestamp ?? Date.now(),
      delta,
      reason: context.reason,
      location: context.location,
      resultingLevel: this.getRelationshipLevel(newAffinity),
    }, currentDay);

    return newAffinity;
  }

  /**
   * Взема профила за отношение или връща празен, без да го запазва.
   */
  public static getRelationshipProfile(gameState: GameState, npcId: string): RelationshipProfile {
    return (
      gameState.relationshipMetadata[npcId] ?? {
        lastInteractionDay: null,
        history: [],
        milestones: [],
      }
    );
  }

  private static getOrCreateProfile(gameState: GameState, npcId: string): RelationshipProfile {
    if (!gameState.relationshipMetadata[npcId]) {
      gameState.relationshipMetadata[npcId] = createEmptyProfile();
    }

    const profile = gameState.relationshipMetadata[npcId];

    return {
      ...profile,
      history: [...profile.history],
      milestones: [...profile.milestones],
    };
  }

  private static getDaysSinceLastInteraction(lastInteractionDay: number | null, currentDay: number): number {
    if (lastInteractionDay === null || !Number.isFinite(currentDay)) {
      return 0;
    }

    return Math.max(0, currentDay - lastInteractionDay);
  }

  private static recordInteraction(
    profile: RelationshipProfile,
    interaction: RelationshipInteraction,
    currentDay: number,
  ): RelationshipProfile {
    const nextProfile: RelationshipProfile = {
      lastInteractionDay: Number.isFinite(currentDay) ? currentDay : profile.lastInteractionDay,
      history: [...profile.history, interaction],
      milestones: profile.milestones,
    };

    return nextProfile;
  }
}

function clampAffinity(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(MIN_AFFINITY, Math.min(MAX_AFFINITY, value));
}

function createEmptyProfile(): RelationshipProfile {
  return {
    lastInteractionDay: null,
    history: [],
    milestones: [],
  };
}
