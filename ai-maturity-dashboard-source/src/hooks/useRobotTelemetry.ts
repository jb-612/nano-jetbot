import { useState, useEffect, useCallback, useRef } from 'react';
import { connectTelemetry } from '../services/websocket';
import type { TelemetryFrame, ConnectionStatus } from '../services/websocket';

interface UseRobotTelemetryResult {
  telemetry: TelemetryFrame | null;
  connectionStatus: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
}

export function useRobotTelemetry(): UseRobotTelemetryResult {
  const [telemetry, setTelemetry] = useState<TelemetryFrame | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const disconnectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    // Disconnect any existing connection first
    if (disconnectRef.current) {
      disconnectRef.current();
      disconnectRef.current = null;
    }

    const connection = connectTelemetry(
      (frame) => {
        setTelemetry(frame);
      },
      (status) => {
        setConnectionStatus(status);
      },
    );

    disconnectRef.current = connection.disconnect;
  }, []);

  const disconnect = useCallback(() => {
    if (disconnectRef.current) {
      disconnectRef.current();
      disconnectRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  useEffect(() => {
    return () => {
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
    };
  }, []);

  return { telemetry, connectionStatus, connect, disconnect };
}
