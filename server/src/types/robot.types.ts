export interface RobotStatus {
  connected: boolean;
  batteryPercent: number;
  wifiSignalDbm: number;
  ipAddress: string;
  uptimeSeconds: number;
  firmwareVersion: string;
  systemTemp: number;
  cpuUsagePercent: number;
  memoryUsageMb: number;
}

export interface TelemetryFrame {
  timestamp: number;
  speed: number;           // 0-100%
  direction: number;       // 0-360 degrees
  batteryPercent: number;
  temperatureCelsius: number;
  leftWheelRpm: number;
  rightWheelRpm: number;
  distanceCm: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
}

export interface MoveCommand {
  direction: 'forward' | 'backward' | 'left' | 'right' | 'stop';
  speed: number; // 0-100
}

export interface MoveResult {
  executed: boolean;
  actualSpeed: number;
  direction: string;
  timestamp: number;
}

export interface CameraCommand {
  action: 'capture' | 'startStream' | 'stopStream';
}

export interface CameraResult {
  action: string;
  success: boolean;
  streamActive: boolean;
  resolution: string;
  fps: number;
}

export interface ServoCommand {
  servoId: number;
  angle: number;
  speed: number;
}

export interface ServoResult {
  servoId: number;
  currentAngle: number;
  targetAngle: number;
  moving: boolean;
}

export interface RobotPart {
  id: string;
  name: string;
  category: string;
  status: 'attached' | 'detached';
  healthPercent: number;
  lastUpdated: number;
}
