import { RobotStateRepository } from '../repositories/robot-state.repository.js';
import { PartsRepository } from '../repositories/parts.repository.js';
import { eventBus } from '../events/event-bus.js';
import type { RobotStatus, MoveCommand, MoveResult, RobotPart } from '../types/robot.types.js';

export class RobotService {
  constructor(
    private stateRepo: RobotStateRepository,
    private partsRepo: PartsRepository,
  ) {}

  getStatus(): RobotStatus {
    return this.stateRepo.getStatus();
  }

  move(command: MoveCommand): MoveResult {
    const actualSpeed = Math.min(command.speed, 100);
    eventBus.emit('robot:move', { direction: command.direction, speed: actualSpeed });
    return {
      executed: true,
      actualSpeed,
      direction: command.direction,
      timestamp: Date.now(),
    };
  }

  getAllParts(): RobotPart[] {
    return this.partsRepo.getAll();
  }

  getPartById(id: string): RobotPart | undefined {
    return this.partsRepo.getById(id);
  }

  updatePart(id: string, updates: Partial<RobotPart>): RobotPart | undefined {
    return this.partsRepo.update(id, updates);
  }
}
