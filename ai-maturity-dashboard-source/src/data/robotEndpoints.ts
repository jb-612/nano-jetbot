export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requestBody?: {
    contentType: string;
    schema: Record<string, unknown>;
    example: Record<string, unknown>;
  };
  responseExample: Record<string, unknown>;
  headers: { name: string; required: boolean; description: string }[];
}

const API_KEY_HEADER = {
  name: 'X-API-Key',
  required: true,
  description:
    'API key for authenticating requests. Obtain from the JetBot admin console under Settings > API Keys.',
};

export const ROBOT_ENDPOINTS: ApiEndpoint[] = [
  // ── 1. GET /api/robot/status ──────────────────────────────────────────
  {
    method: 'GET',
    path: '/api/robot/status',
    summary: 'Retrieve overall robot status',
    description:
      'Returns the current high-level status of the JetBot including power state, battery percentage, WiFi signal strength, CPU/GPU temperatures, and uptime. Use this endpoint for health-check monitoring and dashboard overview panels.',
    responseExample: {
      status: 'ok',
      data: {
        powerState: 'on',
        batteryPercent: 72,
        batteryVoltage: 7.26,
        wifiSignalDbm: -42,
        cpuTemperatureC: 47.5,
        gpuTemperatureC: 44.2,
        uptimeSeconds: 14832,
        motorDriverConnected: true,
        cameraConnected: true,
        timestamp: '2026-02-18T14:32:10.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 2. POST /api/robot/move ───────────────────────────────────────────
  {
    method: 'POST',
    path: '/api/robot/move',
    summary: 'Command the robot to move',
    description:
      'Sends a movement command to the JetBot differential-drive system. Specify a direction and speed. The robot will move continuously at the given speed until a new command is issued or a stop command (speed 0) is sent. Speed is expressed as a fraction of maximum motor PWM duty cycle.',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['direction', 'speed'],
        properties: {
          direction: {
            type: 'string',
            enum: ['forward', 'backward', 'left', 'right', 'stop'],
            description: 'Movement direction for differential-drive steering.',
          },
          speed: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            description:
              'Speed as a fraction of maximum (0.0 = stop, 1.0 = full speed).',
          },
        },
      },
      example: {
        direction: 'forward',
        speed: 0.35,
      },
    },
    responseExample: {
      status: 'ok',
      data: {
        direction: 'forward',
        speed: 0.35,
        leftMotorDuty: 0.35,
        rightMotorDuty: 0.35,
        estimatedCurrentDrawAmps: 0.48,
        timestamp: '2026-02-18T14:33:01.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 3. POST /api/robot/camera ─────────────────────────────────────────
  {
    method: 'POST',
    path: '/api/robot/camera',
    summary: 'Control the CSI camera module',
    description:
      'Controls the onboard IMX219 CSI camera. Supports capturing a single JPEG frame, starting an MJPEG live stream, or stopping an active stream. Captured images are returned as Base64-encoded JPEG. Streams are served at /api/robot/camera/stream once started.',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['action'],
        properties: {
          action: {
            type: 'string',
            enum: ['capture', 'startStream', 'stopStream'],
            description: 'Camera action to perform.',
          },
        },
      },
      example: {
        action: 'capture',
      },
    },
    responseExample: {
      status: 'ok',
      data: {
        action: 'capture',
        resolution: { width: 1280, height: 720 },
        format: 'jpeg',
        sizeBytes: 184320,
        imageBase64: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA...truncated...',
        timestamp: '2026-02-18T14:34:15.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 4. GET /api/robot/telemetry ───────────────────────────────────────
  {
    method: 'GET',
    path: '/api/robot/telemetry',
    summary: 'Retrieve real-time telemetry data',
    description:
      'Returns a comprehensive snapshot of robot telemetry including motor speeds, battery state-of-charge, IMU readings (if available), current draw per rail, CPU/GPU utilization, and memory usage. Designed for time-series ingestion and live telemetry dashboards.',
    responseExample: {
      status: 'ok',
      data: {
        motors: {
          left: { dutyPercent: 35, rpmEstimated: 142, currentAmps: 0.24 },
          right: { dutyPercent: 35, rpmEstimated: 140, currentAmps: 0.25 },
        },
        battery: {
          voltageV: 7.26,
          currentAmps: 1.12,
          percent: 72,
          temperatureC: 31.4,
          chargeCycles: 48,
        },
        system: {
          cpuUsagePercent: 34.2,
          gpuUsagePercent: 61.8,
          memoryUsedMb: 2048,
          memoryTotalMb: 4096,
          diskUsedGb: 11.4,
          diskTotalGb: 32,
          cpuTemperatureC: 47.5,
          gpuTemperatureC: 44.2,
        },
        network: {
          wifiSsid: 'JetBot-Lab-5G',
          wifiSignalDbm: -42,
          ipAddress: '192.168.1.117',
          txBytesPerSec: 524288,
          rxBytesPerSec: 12480,
        },
        timestamp: '2026-02-18T14:35:22.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 5. POST /api/robot/servo ──────────────────────────────────────────
  {
    method: 'POST',
    path: '/api/robot/servo',
    summary: 'Control an individual servo motor',
    description:
      'Commands a specific servo channel on the PCA9685 motor driver board to move to a target angle at a given speed. Useful for pan/tilt camera mounts or gripper attachments. Servo IDs correspond to PCA9685 channels (0-15). Angle is in degrees (0-180). Speed controls the slew rate.',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        required: ['servoId', 'angle', 'speed'],
        properties: {
          servoId: {
            type: 'integer',
            minimum: 0,
            maximum: 15,
            description: 'PCA9685 channel number (0-15).',
          },
          angle: {
            type: 'number',
            minimum: 0,
            maximum: 180,
            description: 'Target angle in degrees.',
          },
          speed: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            description:
              'Slew rate as a fraction of maximum (0.0 = slowest, 1.0 = fastest).',
          },
        },
      },
      example: {
        servoId: 0,
        angle: 90,
        speed: 0.5,
      },
    },
    responseExample: {
      status: 'ok',
      data: {
        servoId: 0,
        previousAngle: 45,
        targetAngle: 90,
        speed: 0.5,
        estimatedCompletionMs: 320,
        timestamp: '2026-02-18T14:36:05.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 6. GET /api/robot/parts ───────────────────────────────────────────
  {
    method: 'GET',
    path: '/api/robot/parts',
    summary: 'List all robot parts',
    description:
      'Returns the complete bill of materials for the JetBot digital twin, including each part\'s category, criticality, weight, dimensions, material composition, electrical characteristics, and dependency relationships. Supports optional query parameters for filtering by category or criticality.',
    responseExample: {
      status: 'ok',
      data: {
        totalParts: 11,
        parts: [
          {
            id: 'chassis',
            name: 'Chassis/Cart',
            category: 'structural',
            criticality: 'critical',
            weightGrams: 320,
            materialIds: ['mat-pla'],
            isRemovable: false,
          },
          {
            id: 'jetson-nano',
            name: 'NVIDIA Jetson Nano Board',
            category: 'compute',
            criticality: 'critical',
            weightGrams: 140,
            materialIds: ['mat-fr4', 'mat-silicon', 'mat-copper', 'mat-aluminum'],
            isRemovable: true,
          },
        ],
      },
    },
    headers: [API_KEY_HEADER],
  },

  // ── 7. PUT /api/robot/parts/:id ───────────────────────────────────────
  {
    method: 'PUT',
    path: '/api/robot/parts/:id',
    summary: 'Update a robot part',
    description:
      'Updates mutable properties of a specific robot part identified by its ID. Only fields included in the request body will be modified; omitted fields remain unchanged. Commonly used to update descriptions, criticality levels, or connectivity information in the digital twin model.',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Updated human-readable description of the part.',
          },
          criticality: {
            type: 'string',
            enum: ['critical', 'high', 'medium', 'low'],
            description: 'Updated criticality classification.',
          },
          connectedPartIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Updated list of connected part IDs.',
          },
          isRemovable: {
            type: 'boolean',
            description: 'Whether the part can be removed without tools.',
          },
        },
      },
      example: {
        description:
          'Upgraded CSI camera module with IR filter removed for night-vision capability.',
        criticality: 'critical',
      },
    },
    responseExample: {
      status: 'ok',
      data: {
        id: 'camera-module',
        name: 'CSI Camera Module',
        description:
          'Upgraded CSI camera module with IR filter removed for night-vision capability.',
        category: 'sensor',
        criticality: 'critical',
        weightGrams: 24,
        updatedAt: '2026-02-18T14:37:44.000Z',
      },
    },
    headers: [API_KEY_HEADER],
  },
];
