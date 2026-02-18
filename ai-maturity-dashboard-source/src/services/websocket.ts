export interface TelemetryFrame {
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

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

type OnMessage = (frame: TelemetryFrame) => void;
type OnStatus = (status: ConnectionStatus) => void;

interface TelemetryConnection {
  disconnect: () => void;
}

const MAX_RECONNECT_DELAY_MS = 30_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

export function connectTelemetry(
  onMessage: OnMessage,
  onStatus?: OnStatus,
): TelemetryConnection {
  let ws: WebSocket | null = null;
  let reconnectAttempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  function getWsUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws/telemetry`;
  }

  function scheduleReconnect(): void {
    if (disposed) return;

    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttempt),
      MAX_RECONNECT_DELAY_MS,
    );
    reconnectAttempt++;

    reconnectTimer = setTimeout(() => {
      if (!disposed) {
        connect();
      }
    }, delay);
  }

  function connect(): void {
    if (disposed) return;

    onStatus?.('connecting');

    try {
      ws = new WebSocket(getWsUrl());
    } catch {
      onStatus?.('disconnected');
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      reconnectAttempt = 0;
      onStatus?.('connected');
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const frame = JSON.parse(event.data as string) as TelemetryFrame;
        onMessage(frame);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      onStatus?.('disconnected');
      scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose will fire after onerror, triggering reconnect
    };
  }

  function disconnect(): void {
    disposed = true;

    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.onopen = null;
      ws.close();
      ws = null;
    }

    onStatus?.('disconnected');
  }

  connect();

  return { disconnect };
}
