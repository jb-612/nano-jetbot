import type { RobotStatus } from '../types/robot.types.js';
import { INITIAL_STATUS } from '../mock-data/initial-state.js';

export class RobotStateRepository {
  private state: RobotStatus = { ...INITIAL_STATUS };
  private startTime = Date.now();

  getStatus(): RobotStatus {
    return {
      ...this.state,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  updateStatus(updates: Partial<RobotStatus>): RobotStatus {
    this.state = { ...this.state, ...updates };
    return this.getStatus();
  }
}
