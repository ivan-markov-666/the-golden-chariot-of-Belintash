import type { Scenario } from '@/game/types';

export interface ScenarioCacheEntry {
  scenario: Scenario;
  addedAt: number;
  lastAccess: number;
  hits: number;
}

export interface ScenarioCacheStats {
  size: number;
  capacity: number;
  entries: ScenarioCacheEntrySummary[];
}

export interface ScenarioCacheEntrySummary {
  id: string;
  addedAt: number;
  lastAccess: number;
  hits: number;
}

const DEFAULT_CAPACITY = 20;

export class ScenarioCache {
  private readonly capacity: number;
  private readonly entries = new Map<string, ScenarioCacheEntry>();

  constructor(capacity: number = DEFAULT_CAPACITY) {
    if (capacity <= 0 || !Number.isFinite(capacity)) {
      throw new Error('ScenarioCache capacity must be a positive finite number.');
    }
    this.capacity = Math.floor(capacity);
  }

  public get(scenarioId: string): Scenario | null {
    const entry = this.entries.get(scenarioId);
    if (!entry) {
      return null;
    }

    entry.hits += 1;
    entry.lastAccess = Date.now();
    this.bumpEntry(scenarioId, entry);
    return entry.scenario;
  }

  public set(scenarioId: string, scenario: Scenario): void {
    const now = Date.now();
    if (this.entries.has(scenarioId)) {
      const entry = this.entries.get(scenarioId)!;
      entry.scenario = scenario;
      entry.lastAccess = now;
      this.bumpEntry(scenarioId, entry);
      return;
    }

    if (this.entries.size >= this.capacity) {
      this.evictLeastRecentlyUsed();
    }

    this.entries.set(scenarioId, {
      scenario,
      addedAt: now,
      lastAccess: now,
      hits: 0,
    });
  }

  public has(scenarioId: string): boolean {
    return this.entries.has(scenarioId);
  }

  public delete(scenarioId: string): boolean {
    return this.entries.delete(scenarioId);
  }

  public clear(): void {
    this.entries.clear();
  }

  public size(): number {
    return this.entries.size;
  }

  public getStats(): ScenarioCacheStats {
    const entries: ScenarioCacheEntrySummary[] = Array.from(this.entries.entries()).map(
      ([id, entry]) => ({
        id,
        addedAt: entry.addedAt,
        lastAccess: entry.lastAccess,
        hits: entry.hits,
      }),
    );

    return {
      size: this.entries.size,
      capacity: this.capacity,
      entries,
    };
  }

  private bumpEntry(id: string, entry: ScenarioCacheEntry): void {
    this.entries.delete(id);
    this.entries.set(id, entry);
  }

  private evictLeastRecentlyUsed(): void {
    const iterator = this.entries.keys().next();
    if (!iterator.done) {
      this.entries.delete(iterator.value);
    }
  }
}
