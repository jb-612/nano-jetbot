import type { RobotPart } from '../types/robot.types.js';
import { INITIAL_PARTS } from '../mock-data/initial-state.js';

export class PartsRepository {
  private parts: Map<string, RobotPart> = new Map(
    INITIAL_PARTS.map(p => [p.id, { ...p }])
  );

  getAll(): RobotPart[] {
    return [...this.parts.values()];
  }

  getById(id: string): RobotPart | undefined {
    return this.parts.get(id);
  }

  update(id: string, updates: Partial<RobotPart>): RobotPart | undefined {
    const existing = this.parts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, lastUpdated: Date.now() };
    this.parts.set(id, updated);
    return updated;
  }
}
