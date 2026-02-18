import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Thermometer,
  Cpu,
  HardDrive,
  Clock,
  RefreshCw,
  Download,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { useRobotStatus } from '../hooks/useRobotStatus';

// ── Types ─────────────────────────────────────────────────────────

interface LogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'error' | 'success';
}

interface ConnectionConfig {
  ip: string;
  port: string;
  apiKey: string;
}

// ── Helpers ───────────────────────────────────────────────────────

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false });
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function signalStrengthLabel(dbm: number): string {
  if (dbm >= -30) return 'Excellent';
  if (dbm >= -50) return 'Good';
  if (dbm >= -70) return 'Fair';
  return 'Weak';
}

function signalColor(dbm: number): string {
  if (dbm >= -30) return 'text-green-500';
  if (dbm >= -50) return 'text-green-400';
  if (dbm >= -70) return 'text-yellow-500';
  return 'text-red-500';
}

function batteryColor(percent: number): string {
  if (percent >= 60) return 'text-green-500';
  if (percent >= 30) return 'text-yellow-500';
  return 'text-red-500';
}

function tempColor(celsius: number): string {
  if (celsius < 50) return 'text-green-500';
  if (celsius < 70) return 'text-yellow-500';
  return 'text-red-500';
}

function cpuColor(percent: number): string {
  if (percent < 50) return 'text-green-500';
  if (percent < 80) return 'text-yellow-500';
  return 'text-red-500';
}

// ── ConnectionForm ────────────────────────────────────────────────

interface ConnectionFormProps {
  config: ConnectionConfig;
  setConfig: React.Dispatch<React.SetStateAction<ConnectionConfig>>;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({
  config,
  setConfig,
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Connection Settings
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            IP Address
          </label>
          <input
            type="text"
            value={config.ip}
            onChange={(e) => setConfig((c) => ({ ...c, ip: e.target.value }))}
            className={inputClass}
            placeholder="192.168.1.100"
            disabled={isConnected}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Port
          </label>
          <input
            type="text"
            value={config.port}
            onChange={(e) => setConfig((c) => ({ ...c, port: e.target.value }))}
            className={inputClass}
            placeholder="8080"
            disabled={isConnected}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
            className={inputClass}
            placeholder="Enter API key"
            disabled={isConnected}
          />
        </div>
        <div className="flex gap-2 pt-1">
          {!isConnected ? (
            <button
              onClick={onConnect}
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
            >
              Connect
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── StatusCard ────────────────────────────────────────────────────

interface StatusCardProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  subtext?: string;
  colorClass: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon: Icon,
  label,
  value,
  subtext,
  colorClass,
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-3">
    <div className={`mt-0.5 ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtext}</p>
      )}
    </div>
  </div>
);

// ── StatusIndicatorGrid ───────────────────────────────────────────

interface StatusIndicatorGridProps {
  status: {
    connected: boolean;
    batteryPercent: number;
    wifiSignalDbm: number;
    ipAddress: string;
    uptimeSeconds: number;
    firmwareVersion: string;
    systemTemp: number;
    cpuUsagePercent: number;
    memoryUsageMb: number;
  } | null;
  loading: boolean;
}

const StatusIndicatorGrid: React.FC<StatusIndicatorGridProps> = ({ status, loading }) => {
  if (loading && !status) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse h-20"
            />
          ))}
        </div>
      </div>
    );
  }

  const wifi = status?.wifiSignalDbm ?? 0;
  const batt = status?.batteryPercent ?? 0;
  const temp = status?.systemTemp ?? 0;
  const cpu = status?.cpuUsagePercent ?? 0;
  const mem = status?.memoryUsageMb ?? 0;
  const uptime = status?.uptimeSeconds ?? 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        System Status
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <StatusCard
          icon={Wifi}
          label="WiFi Signal"
          value={`${wifi} dBm`}
          subtext={signalStrengthLabel(wifi)}
          colorClass={signalColor(wifi)}
        />
        <StatusCard
          icon={Battery}
          label="Battery"
          value={`${batt}%`}
          subtext={batt <= 20 ? 'Low battery' : undefined}
          colorClass={batteryColor(batt)}
        />
        <StatusCard
          icon={Thermometer}
          label="System Temp"
          value={`${temp.toFixed(1)} C`}
          subtext={temp >= 70 ? 'Throttling risk' : undefined}
          colorClass={tempColor(temp)}
        />
        <StatusCard
          icon={Cpu}
          label="CPU Usage"
          value={`${cpu.toFixed(1)}%`}
          colorClass={cpuColor(cpu)}
        />
        <StatusCard
          icon={HardDrive}
          label="Memory"
          value={`${mem} MB`}
          colorClass="text-blue-500"
        />
        <StatusCard
          icon={Clock}
          label="Uptime"
          value={formatUptime(uptime)}
          colorClass="text-gray-500 dark:text-gray-400"
        />
      </div>
    </div>
  );
};

// ── ConnectionLog ─────────────────────────────────────────────────

interface ConnectionLogProps {
  entries: LogEntry[];
}

const ConnectionLog: React.FC<ConnectionLogProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="bg-gray-950 rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Connection Log
        </h3>
        <span className="text-xs text-gray-500">{entries.length} entries</span>
      </div>
      <div
        ref={scrollRef}
        className="p-4 h-48 overflow-y-auto font-mono text-xs leading-relaxed"
      >
        {entries.map((entry, i) => {
          let textColor = 'text-gray-400';
          if (entry.level === 'error') textColor = 'text-red-400';
          if (entry.level === 'success') textColor = 'text-green-400';

          return (
            <div key={i} className={textColor}>
              <span className="text-gray-600 select-none">&gt; </span>
              <span className="text-gray-500">{entry.timestamp}</span>{' '}
              {entry.message}
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="text-gray-600 italic">No log entries yet. Connect to a robot to begin.</div>
        )}
      </div>
    </div>
  );
};

// ── QuickActions ──────────────────────────────────────────────────

const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Restart', icon: RotateCcw },
    { label: 'Firmware', icon: RefreshCw },
    { label: 'Diagnostics', icon: Wrench },
    { label: 'Export Logs', icon: Download },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="flex gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────

export const RobotConnectivityPage: React.FC = () => {
  const { status, loading, error, refetch } = useRobotStatus();

  const [config, setConfig] = useState<ConnectionConfig>({
    ip: '192.168.1.100',
    port: '8080',
    apiKey: 'dev-key-12345',
  });

  const [isConnected, setIsConnected] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const prevErrorRef = useRef<string | null>(null);
  const prevConnectedRef = useRef<boolean | null>(null);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'info') => {
    const timestamp = formatTime(new Date());
    setLogEntries((prev) => [...prev, { timestamp, message, level }]);
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    addLog(`Connecting to ${config.ip}:${config.port}...`);
    addLog('Handshake initiated, validating API key...');
    refetch();

    // Simulate handshake completion after a short delay
    setTimeout(() => {
      addLog('Handshake complete, connection established', 'success');
      addLog(`API v2.1 | Polling status every 3s`);
    }, 500);
  }, [config.ip, config.port, addLog, refetch]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    addLog('Disconnected from robot', 'info');
  }, [addLog]);

  // Log status poll results
  useEffect(() => {
    if (!isConnected) return;

    if (error && error !== prevErrorRef.current) {
      addLog(`Status poll failed: ${error}`, 'error');
    } else if (status && !error) {
      const connected = status.connected;
      if (prevConnectedRef.current !== connected) {
        if (connected) {
          addLog(`Robot online | IP: ${status.ipAddress} | FW: ${status.firmwareVersion}`, 'success');
        } else {
          addLog('Robot reports disconnected state', 'error');
        }
      }
    }

    prevErrorRef.current = error;
    prevConnectedRef.current = status?.connected ?? null;
  }, [status, error, isConnected, addLog]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top row: Connection Form + Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: ConnectionForm */}
        <ConnectionForm
          config={config}
          setConfig={setConfig}
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Right: StatusIndicatorGrid */}
        <StatusIndicatorGrid status={status} loading={loading} />
      </div>

      {/* Connection Log */}
      <ConnectionLog entries={logEntries} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};
