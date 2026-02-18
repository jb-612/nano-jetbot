import { EventEmitter } from 'events';
import type { TelemetryFrame } from '../types/robot.types.js';

interface EventMap {
  'telemetry:frame': TelemetryFrame;
  'robot:statusChange': { field: string; oldValue: unknown; newValue: unknown };
  'robot:move': { direction: string; speed: number };
  'robot:emergency': { reason: string };
}

class TypedEventBus {
  private emitter = new EventEmitter();

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.emitter.emit(event, data);
  }

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    this.emitter.on(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    this.emitter.off(event, handler);
  }
}

export const eventBus = new TypedEventBus();
