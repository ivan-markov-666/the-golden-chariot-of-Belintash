import { RelationshipService } from '../RelationshipService';
import { createInitialGameState, GameState } from '../../types/gameState';

const createGameState = (): GameState => ({
  ...createInitialGameState(),
  relationshipMetadata: {},
});

describe('RelationshipService', () => {
  describe('getRelationshipLevel', () => {
    it.each([
      [-80, 'enemy'],
      [-25, 'unfriendly'],
      [0, 'neutral'],
      [30, 'friendly'],
      [75, 'close'],
    ])('maps %s to %s', (affinity, expected) => {
      expect(RelationshipService.getRelationshipLevel(affinity as number)).toBe(expected);
    });
  });

  describe('adjustWithDecay', () => {
    it('drifts positive affinity toward zero before applying delta', () => {
      const result = RelationshipService.adjustWithDecay(40, -5, 4);
      // decay 2 points, then apply delta => 33
      expect(result).toBe(33);
    });

    it('drifts negative affinity toward zero before applying delta', () => {
      const result = RelationshipService.adjustWithDecay(-60, 0, 6);
      // decay 3 points toward zero => -57
      expect(result).toBe(-57);
    });

    it('clamps values into [-100, 100]', () => {
      const result = RelationshipService.adjustWithDecay(90, 50, 0);
      expect(result).toBe(100);
    });
  });

  describe('meetsRelationshipRequirement', () => {
    it('compares against stored affinity and defaults to 0', () => {
      const state = createGameState();
      state.relationships['npc.mara'] = 25;

      expect(RelationshipService.meetsRelationshipRequirement('npc.mara', 10, state)).toBe(true);
      expect(RelationshipService.meetsRelationshipRequirement('npc.mara', 30, state)).toBe(false);
      expect(RelationshipService.meetsRelationshipRequirement('npc.unknown', 5, state)).toBe(false);
    });
  });

  describe('applyDelta', () => {
    it('applies decay, updates affinity и записва history/lastInteraction', () => {
      const state = createGameState();
      state.relationships['npc.shade'] = 60;
      state.relationshipMetadata['npc.shade'] = {
        lastInteractionDay: 5,
        history: [],
        milestones: [],
      };

      const updated = RelationshipService.applyDelta(state, 'npc.shade', -10, 10, {
        reason: 'dialogue',
        location: 'market',
        timestamp: 123,
      });

      // 5 days * 0.5 decay => 2.5 decay before delta: 57.5 -> minus 10 => 47.5
      expect(updated).toBeCloseTo(47.5, 5);
      expect(state.relationships['npc.shade']).toBeCloseTo(47.5, 5);

      const profile = state.relationshipMetadata['npc.shade'];
      expect(profile.lastInteractionDay).toBe(10);
      expect(profile.history).toHaveLength(1);
      expect(profile.history[0]).toMatchObject({
        delta: -10,
        reason: 'dialogue',
        location: 'market',
        timestamp: 123,
        resultingLevel: 'friendly',
      });
    });

    it('initializes profile when missing', () => {
      const state = createGameState();

      const updated = RelationshipService.applyDelta(state, 'npc.hermit', 15, 2);

      expect(updated).toBe(15);
      expect(state.relationshipMetadata['npc.hermit']).toBeDefined();
      expect(state.relationshipMetadata['npc.hermit'].history).toHaveLength(1);
    });
  });
});
