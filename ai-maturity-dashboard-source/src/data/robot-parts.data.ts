import type { RobotPart } from '../models/robot-part';
import { MATERIALS_MAP } from './materials.data';

export const ROBOT_PARTS: RobotPart[] = [
  {
    id: 'chassis',
    name: 'Chassis/Cart',
    description:
      'Primary structural frame of the JetBot. 3D-printed PLA body that houses all subsystems and provides mounting points for wheels, compute, power, and sensors.',
    category: 'structural',
    functionDescription:
      'Provides the rigid structural foundation for all robot components. Distributes mechanical loads and defines the overall form factor.',
    materialIds: ['mat-pla'],
    electricalResistance: { valueOhms: 1e12, isOnElectricalPath: false },
    criticality: 'critical',
    weightGrams: 320,
    dimensions: { lengthMm: 200, widthMm: 20, heightMm: 160 },
    connectedPartIds: [
      'wheel-left',
      'wheel-right',
      'caster-ball',
      'battery-pack',
      'wiring-harness',
      'jetson-nano',
      'motor-driver',
    ],
    dependsOnPartIds: [],
    isRemovable: false,
  },
  {
    id: 'wheel-left',
    name: 'Left Drive Wheel',
    description:
      'Left-side drive wheel with aluminum hub and SBR rubber tire. Driven by a DC gearmotor through the motor driver board.',
    category: 'locomotion',
    functionDescription:
      'Converts rotational motor output into linear traction for differential-drive steering on the left side of the robot.',
    materialIds: ['mat-aluminum', 'mat-rubber'],
    electricalResistance: { valueOhms: 0.5, isOnElectricalPath: false },
    criticality: 'high',
    weightGrams: 45,
    dimensions: { lengthMm: 65, widthMm: 25, heightMm: 65 },
    connectedPartIds: ['chassis', 'motor-driver'],
    dependsOnPartIds: ['motor-driver', 'chassis'],
    isRemovable: true,
  },
  {
    id: 'wheel-right',
    name: 'Right Drive Wheel',
    description:
      'Right-side drive wheel with aluminum hub and SBR rubber tire. Driven by a DC gearmotor through the motor driver board.',
    category: 'locomotion',
    functionDescription:
      'Converts rotational motor output into linear traction for differential-drive steering on the right side of the robot.',
    materialIds: ['mat-aluminum', 'mat-rubber'],
    electricalResistance: { valueOhms: 0.5, isOnElectricalPath: false },
    criticality: 'high',
    weightGrams: 45,
    dimensions: { lengthMm: 65, widthMm: 25, heightMm: 65 },
    connectedPartIds: ['chassis', 'motor-driver'],
    dependsOnPartIds: ['motor-driver', 'chassis'],
    isRemovable: true,
  },
  {
    id: 'antenna-left',
    name: 'Left WiFi Antenna',
    description:
      'Primary 2.4/5 GHz dual-band WiFi antenna connected to the Jetson Nano for wireless communication and remote control.',
    category: 'communication',
    functionDescription:
      'Provides the primary wireless link for SSH access, telemetry streaming, and remote command reception.',
    materialIds: ['mat-copper', 'mat-pla'],
    electricalResistance: { valueOhms: 0.02, isOnElectricalPath: true },
    criticality: 'medium',
    weightGrams: 8,
    dimensions: { lengthMm: 5, widthMm: 70, heightMm: 5 },
    connectedPartIds: ['jetson-nano'],
    dependsOnPartIds: ['jetson-nano'],
    isRemovable: true,
  },
  {
    id: 'antenna-right',
    name: 'Right WiFi Antenna',
    description:
      'Secondary 2.4/5 GHz dual-band WiFi antenna for MIMO diversity reception, improving signal reliability and throughput.',
    category: 'communication',
    functionDescription:
      'Provides MIMO diversity for improved wireless signal quality. Serves as a redundant antenna path.',
    materialIds: ['mat-copper', 'mat-pla'],
    electricalResistance: { valueOhms: 0.02, isOnElectricalPath: true },
    criticality: 'low',
    weightGrams: 8,
    dimensions: { lengthMm: 5, widthMm: 70, heightMm: 5 },
    connectedPartIds: ['jetson-nano'],
    dependsOnPartIds: ['jetson-nano'],
    isRemovable: true,
  },
  {
    id: 'jetson-nano',
    name: 'NVIDIA Jetson Nano Board',
    description:
      'NVIDIA Jetson Nano Developer Kit (B01 revision) serving as the main compute unit. Runs Ubuntu 18.04 with JetPack SDK for AI inference and robot control.',
    category: 'compute',
    functionDescription:
      'Executes all onboard AI inference (object detection, lane following), processes sensor data, runs ROS nodes, and coordinates all subsystem communication via GPIO, I2C, and CSI interfaces.',
    materialIds: ['mat-fr4', 'mat-silicon', 'mat-copper', 'mat-aluminum'],
    electricalResistance: { valueOhms: 0.05, isOnElectricalPath: true },
    criticality: 'critical',
    weightGrams: 140,
    dimensions: { lengthMm: 100, widthMm: 29, heightMm: 80 },
    connectedPartIds: [
      'chassis',
      'camera-module',
      'antenna-left',
      'antenna-right',
      'motor-driver',
      'wiring-harness',
    ],
    dependsOnPartIds: ['battery-pack', 'wiring-harness'],
    isRemovable: true,
  },
  {
    id: 'camera-module',
    name: 'CSI Camera Module',
    description:
      'IMX219 8-megapixel CSI camera module with 160-degree wide-angle lens. Connected to the Jetson Nano via a 15-pin CSI ribbon cable.',
    category: 'sensor',
    functionDescription:
      'Captures real-time video frames for computer-vision inference including object detection, collision avoidance, and lane following.',
    materialIds: ['mat-fr4', 'mat-glass', 'mat-pla'],
    electricalResistance: { valueOhms: 0.08, isOnElectricalPath: true },
    criticality: 'critical',
    weightGrams: 24,
    dimensions: { lengthMm: 25, widthMm: 24, heightMm: 9 },
    connectedPartIds: ['jetson-nano'],
    dependsOnPartIds: ['jetson-nano'],
    isRemovable: true,
  },
  {
    id: 'battery-pack',
    name: 'Li-Ion Battery Pack',
    description:
      'Rechargeable 7.4V 2S Li-Ion battery pack (2x 18650 cells) providing regulated power to the Jetson Nano and motor driver.',
    category: 'power',
    functionDescription:
      'Supplies regulated DC power to all active electronic subsystems. Provides approximately 2-3 hours of operation under typical load.',
    materialIds: ['mat-liion-casing', 'mat-copper'],
    electricalResistance: { valueOhms: 0.03, isOnElectricalPath: true },
    criticality: 'critical',
    weightGrams: 195,
    dimensions: { lengthMm: 105, widthMm: 30, heightMm: 68 },
    connectedPartIds: ['chassis', 'wiring-harness', 'jetson-nano'],
    dependsOnPartIds: ['chassis'],
    isRemovable: true,
  },
  {
    id: 'motor-driver',
    name: 'Motor Driver Board (PCA9685)',
    description:
      'Adafruit PCA9685-based motor driver HAT providing dual H-bridge motor control via I2C. Controls both DC gearmotors for differential steering.',
    category: 'electrical',
    functionDescription:
      'Translates I2C PWM commands from the Jetson Nano into variable-voltage motor drive signals for precise speed and direction control of both wheels.',
    materialIds: ['mat-fr4', 'mat-copper', 'mat-silicon'],
    electricalResistance: { valueOhms: 0.04, isOnElectricalPath: true },
    criticality: 'critical',
    weightGrams: 28,
    dimensions: { lengthMm: 62, widthMm: 18, heightMm: 26 },
    connectedPartIds: [
      'chassis',
      'wheel-left',
      'wheel-right',
      'wiring-harness',
      'jetson-nano',
    ],
    dependsOnPartIds: ['jetson-nano', 'wiring-harness'],
    isRemovable: true,
  },
  {
    id: 'caster-ball',
    name: 'Front Caster Ball',
    description:
      'Stainless steel ball caster mounted at the front of the chassis, providing a low-friction third contact point for stability.',
    category: 'structural',
    functionDescription:
      'Provides passive, omnidirectional ground contact at the front of the robot to maintain three-point stability during differential-drive maneuvers.',
    materialIds: ['mat-steel', 'mat-pla'],
    electricalResistance: { valueOhms: 1e6, isOnElectricalPath: false },
    criticality: 'high',
    weightGrams: 35,
    dimensions: { lengthMm: 25, widthMm: 30, heightMm: 25 },
    connectedPartIds: ['chassis'],
    dependsOnPartIds: ['chassis'],
    isRemovable: true,
  },
  {
    id: 'wiring-harness',
    name: 'Wiring Harness',
    description:
      'Complete wiring loom consisting of power distribution cables, I2C data lines, motor wires, and CSI ribbon cable. PVC-insulated copper conductors.',
    category: 'wiring',
    functionDescription:
      'Routes electrical power from the battery to all active components and carries data signals (I2C, CSI, GPIO) between the Jetson Nano and peripheral devices.',
    materialIds: ['mat-copper', 'mat-pvc'],
    electricalResistance: { valueOhms: 0.01, isOnElectricalPath: true },
    criticality: 'critical',
    weightGrams: 42,
    dimensions: { lengthMm: 200, widthMm: 5, heightMm: 160 },
    connectedPartIds: [
      'chassis',
      'battery-pack',
      'jetson-nano',
      'motor-driver',
    ],
    dependsOnPartIds: ['chassis'],
    isRemovable: true,
  },
];

export const ROBOT_PARTS_MAP: Map<string, RobotPart> = new Map(
  ROBOT_PARTS.map((p) => [p.id, p]),
);
