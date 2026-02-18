const API_BASE = '/api/robot';
const API_KEY = 'dev-key-12345';

interface ApiOptions extends RequestInit {
  body?: string;
}

async function apiFetch<T>(path: string, options?: ApiOptions): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'X-API-Key': API_KEY,
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

// ── Response types ────────────────────────────────────────────────

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

export interface TelemetryData {
  motors: {
    left: { dutyPercent: number; rpmEstimated: number; currentAmps: number };
    right: { dutyPercent: number; rpmEstimated: number; currentAmps: number };
  };
  battery: {
    voltageV: number;
    currentAmps: number;
    percent: number;
    temperatureC: number;
    chargeCycles: number;
  };
  system: {
    cpuUsagePercent: number;
    gpuUsagePercent: number;
    memoryUsedMb: number;
    memoryTotalMb: number;
    diskUsedGb: number;
    diskTotalGb: number;
    cpuTemperatureC: number;
    gpuTemperatureC: number;
  };
  network: {
    wifiSsid: string;
    wifiSignalDbm: number;
    ipAddress: string;
    txBytesPerSec: number;
    rxBytesPerSec: number;
  };
  timestamp: string;
}

interface MoveResponse {
  direction: string;
  speed: number;
  leftMotorDuty: number;
  rightMotorDuty: number;
  estimatedCurrentDrawAmps: number;
  timestamp: string;
}

interface CameraResponse {
  action: string;
  resolution: { width: number; height: number };
  format: string;
  sizeBytes: number;
  imageBase64?: string;
  timestamp: string;
}

interface ServoResponse {
  servoId: number;
  previousAngle: number;
  targetAngle: number;
  speed: number;
  estimatedCompletionMs: number;
  timestamp: string;
}

interface PartSummary {
  id: string;
  name: string;
  category: string;
  criticality: string;
  weightGrams: number;
  materialIds: string[];
  isRemovable: boolean;
}

interface PartsListResponse {
  totalParts: number;
  parts: PartSummary[];
}

interface PartUpdateResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  criticality: string;
  weightGrams: number;
  updatedAt: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

// ── Exported API functions ────────────────────────────────────────

export async function getRobotStatus(): Promise<RobotStatus> {
  const res = await apiFetch<ApiResponse<RobotStatus>>('/status');
  return res.data;
}

export async function getRobotTelemetry(): Promise<TelemetryData> {
  const res = await apiFetch<ApiResponse<TelemetryData>>('/telemetry');
  return res.data;
}

export async function moveRobot(
  direction: 'forward' | 'backward' | 'left' | 'right' | 'stop',
  speed: number,
): Promise<MoveResponse> {
  const res = await apiFetch<ApiResponse<MoveResponse>>('/move', {
    method: 'POST',
    body: JSON.stringify({ direction, speed }),
  });
  return res.data;
}

export async function controlCamera(
  action: 'capture' | 'startStream' | 'stopStream',
): Promise<CameraResponse> {
  const res = await apiFetch<ApiResponse<CameraResponse>>('/camera', {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
  return res.data;
}

export async function controlServo(
  servoId: number,
  angle: number,
  speed: number,
): Promise<ServoResponse> {
  const res = await apiFetch<ApiResponse<ServoResponse>>('/servo', {
    method: 'POST',
    body: JSON.stringify({ servoId, angle, speed }),
  });
  return res.data;
}

export async function getRobotParts(): Promise<PartsListResponse> {
  const res = await apiFetch<ApiResponse<PartsListResponse>>('/parts');
  return res.data;
}

export async function updateRobotPart(
  id: string,
  updates: Record<string, unknown>,
): Promise<PartUpdateResponse> {
  const res = await apiFetch<ApiResponse<PartUpdateResponse>>(`/parts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return res.data;
}
