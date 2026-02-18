import type { RobotStatus, RobotPart } from '../types/robot.types.js';

export const INITIAL_STATUS: RobotStatus = {
  connected: true,
  batteryPercent: 87,
  wifiSignalDbm: -42,
  ipAddress: '192.168.1.100',
  uptimeSeconds: 3600,
  firmwareVersion: '2.1.4',
  systemTemp: 42.5,
  cpuUsagePercent: 23,
  memoryUsageMb: 1024,
};

export const INITIAL_PARTS: RobotPart[] = [
  // All 11 parts with status 'attached', healthPercent: 100
  { id: 'chassis', name: 'Chassis / Cart', category: 'structural', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'wheel-left', name: 'Left Drive Wheel', category: 'locomotion', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'wheel-right', name: 'Right Drive Wheel', category: 'locomotion', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'antenna-left', name: 'Left WiFi Antenna', category: 'communication', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'antenna-right', name: 'Right WiFi Antenna', category: 'communication', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'jetson-nano', name: 'NVIDIA Jetson Nano Board', category: 'compute', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'camera-module', name: 'CSI Camera Module', category: 'sensor', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'battery-pack', name: 'Li-Ion Battery Pack', category: 'power', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'motor-driver', name: 'Motor Driver Board', category: 'electrical', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'caster-ball', name: 'Front Caster Ball', category: 'structural', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
  { id: 'wiring-harness', name: 'Wiring Harness', category: 'wiring', status: 'attached', healthPercent: 100, lastUpdated: Date.now() },
];
