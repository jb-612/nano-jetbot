import { eventBus } from '../events/event-bus.js';
import { config } from '../config.js';
import type { TelemetryFrame } from '../types/robot.types.js';

export class TelemetryService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastFrame: TelemetryFrame | null = null;

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      const frame = this.generateFrame();
      this.lastFrame = frame;
      eventBus.emit('telemetry:frame', frame);
    }, config.telemetryIntervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getLatest(): TelemetryFrame | null {
    return this.lastFrame;
  }

  private generateFrame(): TelemetryFrame {
    const now = Date.now();
    return {
      timestamp: now,
      speed: 30 + Math.random() * 20,
      direction: Math.random() * 360,
      batteryPercent: 85 + Math.random() * 5,
      temperatureCelsius: 40 + Math.random() * 10,
      leftWheelRpm: 100 + Math.random() * 50,
      rightWheelRpm: 100 + Math.random() * 50,
      distanceCm: Math.floor(Math.random() * 1000),
      gyroX: (Math.random() - 0.5) * 2,
      gyroY: (Math.random() - 0.5) * 2,
      gyroZ: (Math.random() - 0.5) * 2,
    };
  }
}
