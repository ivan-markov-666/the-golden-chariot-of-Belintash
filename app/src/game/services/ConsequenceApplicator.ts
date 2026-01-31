import { Consequence } from '../types/consequence';
import { GameState } from '../types/gameState';
import { PlayerCharacter } from '../types/character';
import { RelationshipService } from './RelationshipService';

const DEV_MODE = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

type UnlockCategory = 'shop' | 'dialogue' | 'quest' | 'location';

export type ConsequenceEvent =
  | { type: 'level_up'; newLevel: number }
  | { type: 'death' }
  | { type: 'trigger_event'; eventName: string; data?: Record<string, unknown> }
  | { type: 'unlock'; category: UnlockCategory; id: string }
  | { type: 'item_change'; action: 'add' | 'remove'; itemId: string; quantity: number }
  | { type: 'gold_change'; newTotal: number }
  | { type: 'relationship_change'; target: string; value: number };

export interface ApplyResult {
  success: boolean;
  error?: unknown;
  events: ConsequenceEvent[];
  warnings: string[];
}

type Snapshot = {
  gameState: GameState;
  character: PlayerCharacter;
};

type TransactionContext = {
  events: ConsequenceEvent[];
  warnings: string[];
  initialLevel: number;
  initialHealth: number;
};

export class ConsequenceApplicator {
  public static async apply(
    consequences: Consequence[],
    gameState: GameState,
    character: PlayerCharacter,
  ): Promise<ApplyResult> {
    const snapshot = this.createSnapshot(gameState, character);
    const context = this.createContext(character);

    try {
      for (const consequence of consequences) {
        this.applyConsequence(consequence, gameState, character, context);
      }

      this.handleSideEffects(gameState, character, context);

      return { success: true, events: context.events, warnings: context.warnings };
    } catch (error) {
      this.rollback(snapshot, gameState, character);
      this.warn(context, 'Transaction rolled back due to error', { error });
      return { success: false, error, events: context.events, warnings: context.warnings };
    }
  }

  private static createContext(character: PlayerCharacter): TransactionContext {
    return {
      events: [],
      warnings: [],
      initialLevel: character.level,
      initialHealth: character.health,
    };
  }

  private static createSnapshot(gameState: GameState, character: PlayerCharacter): Snapshot {
    return {
      gameState: deepClone(gameState),
      character: deepClone(character),
    };
  }

  private static rollback(
    snapshot: Snapshot,
    gameState: GameState,
    character: PlayerCharacter,
  ): void {
    Object.assign(gameState, deepClone(snapshot.gameState));
    Object.assign(character, deepClone(snapshot.character));
  }

  private static applyConsequence(
    consequence: Consequence,
    gameState: GameState,
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    switch (consequence.type) {
      case 'flag':
        gameState.flags[consequence.target] = consequence.value;
        break;
      case 'counter':
        this.applyCounter(consequence, gameState, context);
        break;
      case 'stat':
        this.applyStat(consequence, character, context);
        break;
      case 'skill':
        this.applySkill(consequence, character, context);
        break;
      case 'item':
        this.applyItem(consequence, character, context);
        break;
      case 'experience':
        this.adjustExperience(consequence.value, character, context);
        break;
      case 'health':
        this.adjustHealth(consequence.value, character, consequence.canKill ?? false, context);
        break;
      case 'mana':
        this.adjustMana(consequence.value, character, context);
        break;
      case 'gold':
        this.adjustGold(consequence.value, character, context);
        break;
      case 'relationship':
        this.adjustRelationship(consequence.target, consequence.value, gameState, context);
        break;
      case 'unlock_shop':
        this.unlockEntry(gameState.unlockedShops, consequence.target, 'shop', context);
        break;
      case 'unlock_dialogue':
        this.unlockEntry(gameState.unlockedDialogues, consequence.target, 'dialogue', context);
        break;
      case 'unlock_quest':
        this.unlockEntry(gameState.unlockedQuests, consequence.target, 'quest', context);
        break;
      case 'unlock_location':
        this.unlockEntry(gameState.unlockedLocations, consequence.target, 'location', context);
        break;
      case 'trigger_event':
        this.triggerEvent(consequence.target, consequence.data, context);
        break;
      case 'set_location':
        gameState.location = consequence.target;
        break;
      default:
        throw new Error(`Unsupported consequence type ${(consequence as Consequence).type}`);
    }
  }

  private static applyCounter(
    consequence: Consequence & { type: 'counter' },
    gameState: GameState,
    context: TransactionContext,
  ): void {
    if (!Number.isFinite(consequence.value)) {
      this.warn(context, 'Counter consequence received non-finite value', { consequence });
      return;
    }

    const current = gameState.counters[consequence.target] ?? 0;

    switch (consequence.action) {
      case 'set':
        gameState.counters[consequence.target] = consequence.value;
        break;
      case 'increment':
        gameState.counters[consequence.target] = current + consequence.value;
        break;
      case 'decrement':
        gameState.counters[consequence.target] = current - consequence.value;
        break;
    }
  }

  private static applyStat(
    consequence: Consequence & { type: 'stat' },
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    if (!(consequence.target in character.attributes)) {
      this.warn(context, `Unknown stat '${consequence.target}' – initializing to 0`);
      character.attributes[consequence.target] = 0;
    }

    const current = character.attributes[consequence.target] ?? 0;

    switch (consequence.action) {
      case 'set':
        character.attributes[consequence.target] = consequence.value;
        break;
      case 'increase':
        character.attributes[consequence.target] = current + consequence.value;
        break;
      case 'decrease':
        character.attributes[consequence.target] = current - consequence.value;
        break;
    }
  }

  private static applySkill(
    consequence: Consequence & { type: 'skill' },
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    if (!(consequence.target in character.skills)) {
      this.warn(context, `Unknown skill '${consequence.target}' – initializing to 0`);
      character.skills[consequence.target] = 0;
    }

    const current = character.skills[consequence.target] ?? 0;

    switch (consequence.action) {
      case 'set':
        character.skills[consequence.target] = consequence.value;
        break;
      case 'increase':
        character.skills[consequence.target] = current + consequence.value;
        break;
      case 'decrease':
        character.skills[consequence.target] = Math.max(0, current - consequence.value);
        break;
    }
  }

  private static applyItem(
    consequence: Consequence & { type: 'item' },
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    const quantity = consequence.quantity ?? 1;

    if (quantity <= 0) {
      this.warn(context, 'Item consequence specifies non-positive quantity', { consequence });
      return;
    }

    if (consequence.action === 'add') {
      this.addItem(consequence.target, quantity, consequence.autoEquip, character, context);
    } else {
      this.removeItem(consequence.target, quantity, character, context);
    }
  }

  private static addItem(
    itemId: string,
    quantity: number,
    autoEquip: boolean | undefined,
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    const existing = character.inventory.find((item) => item.id === itemId);

    if (existing) {
      existing.quantity = (existing.quantity ?? 1) + quantity;
    } else {
      character.inventory.push({ id: itemId, quantity });
    }

    if (autoEquip) {
      character.equipment.weapon = { id: itemId, quantity: 1, equipped: true };
    }

    this.recordEvent(context, {
      type: 'item_change',
      action: 'add',
      itemId,
      quantity,
    });
  }

  private static removeItem(
    itemId: string,
    quantity: number,
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    let remaining = quantity;

    character.inventory = character.inventory.reduce((result, item) => {
      if (item.id !== itemId) {
        result.push(item);
        return result;
      }

      const currentQuantity = item.quantity ?? 1;

      if (currentQuantity > remaining) {
        result.push({ ...item, quantity: currentQuantity - remaining });
        remaining = 0;
      } else {
        remaining -= currentQuantity;
      }

      return result;
    }, [] as typeof character.inventory);

    const removed = quantity - remaining;

    if (remaining > 0) {
      this.warn(context, `Attempted to remove more items than owned for ${itemId}`);
    }

    if (removed > 0) {
      this.recordEvent(context, {
        type: 'item_change',
        action: 'remove',
        itemId,
        quantity: removed,
      });
    }

    Object.keys(character.equipment).forEach((slot) => {
      if (character.equipment[slot]?.id === itemId && character.equipment[slot]) {
        character.equipment[slot] = undefined;
      }
    });
  }

  private static adjustExperience(
    amount: number,
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    character.experience += amount;

    while (character.experience >= 100) {
      character.experience -= 100;
      character.level += 1;
    }
  }

  private static adjustHealth(
    amount: number,
    character: PlayerCharacter,
    canKill: boolean,
    context: TransactionContext,
  ): void {
    const newHealth = character.health + amount;

    if (!canKill && newHealth <= 0) {
      throw new Error('Health drop would kill player but canKill is false');
    }

    character.health = Math.max(0, Math.min(character.maxHealth, newHealth));
  }

  private static adjustMana(amount: number, character: PlayerCharacter, context: TransactionContext): void {
    character.mana = Math.max(0, Math.min(character.maxMana, character.mana + amount));
  }

  private static adjustGold(amount: number, character: PlayerCharacter, context: TransactionContext): void {
    character.gold = Math.max(0, character.gold + amount);
    this.recordEvent(context, { type: 'gold_change', newTotal: character.gold });
  }

  private static adjustRelationship(
    target: string,
    amount: number,
    gameState: GameState,
    context: TransactionContext,
  ): void {
    const currentDay = gameState.gameTime?.day ?? 0;
    const newValue = RelationshipService.applyDelta(gameState, target, amount, currentDay, {
      reason: 'consequence',
      location: gameState.location,
    });

    this.recordEvent(context, { type: 'relationship_change', target, value: newValue });
  }

  private static unlockEntry(
    list: string[],
    entry: string,
    category: UnlockCategory,
    context: TransactionContext,
  ): void {
    if (!list.includes(entry)) {
      list.push(entry);
      this.recordEvent(context, { type: 'unlock', category, id: entry });
    }
  }

  private static triggerEvent(
    eventName: string,
    data: Record<string, unknown> | undefined,
    context: TransactionContext,
  ): void {
    this.recordEvent(context, { type: 'trigger_event', eventName, data });
    if (DEV_MODE) {
      console.debug('[ConsequenceApplicator] Event triggered', { eventName, data });
    }
  }

  private static handleSideEffects(
    _gameState: GameState,
    character: PlayerCharacter,
    context: TransactionContext,
  ): void {
    if (character.level > context.initialLevel) {
      this.recordEvent(context, { type: 'level_up', newLevel: character.level });
    }

    if (character.health <= 0 && context.initialHealth > 0) {
      this.recordEvent(context, { type: 'death' });
    }
  }

  private static recordEvent(context: TransactionContext, event: ConsequenceEvent): void {
    context.events.push(event);
  }

  private static warn(context: TransactionContext, message: string, meta?: Record<string, unknown>): void {
    const payload = meta ? `${message} :: ${JSON.stringify(meta)}` : message;

    if (DEV_MODE) {
      console.warn('[ConsequenceApplicator] Warning', payload);
    }

    context.warnings.push(message);
  }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
