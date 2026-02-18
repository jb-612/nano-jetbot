import { useState, useEffect, useCallback, useRef } from 'react';
import { getRobotStatus } from '../services/api';
import type { RobotStatus } from '../services/api';

const POLL_INTERVAL_MS = 3_000;

interface UseRobotStatusResult {
  status: RobotStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRobotStatus(): UseRobotStatusResult {
  const [status, setStatus] = useState<RobotStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getRobotStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch robot status';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();

    intervalRef.current = setInterval(() => {
      void fetchStatus();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStatus]);

  const refetch = useCallback(() => {
    setLoading(true);
    void fetchStatus();
  }, [fetchStatus]);

  return { status, loading, error, refetch };
}
