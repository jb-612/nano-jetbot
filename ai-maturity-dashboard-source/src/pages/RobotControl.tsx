import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gauge,
  OctagonX,
  ChevronUp,
} from 'lucide-react';
import { moveRobot, controlCamera } from '../services/api';
import { useGamepad } from '../hooks/useGamepad';
import { useRobotTelemetry } from '../hooks/useRobotTelemetry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommandEntry {
  id: number;
  timestamp: string;
  direction: string;
  speed: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function clampGaugeValue(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

const MAX_HISTORY = 50;

// ---------------------------------------------------------------------------
// TelemetryGauge - SVG radial gauge
// ---------------------------------------------------------------------------

interface TelemetryGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  warningThreshold: number;
  criticalThreshold: number;
  size?: number;
}

const TelemetryGauge: React.FC<TelemetryGaugeProps> = ({
  value,
  max,
  label,
  unit,
  warningThreshold,
  criticalThreshold,
  size = 120,
}) => {
  const clamped = clampGaugeValue(value, max);
  const percentage = (clamped / max) * 100;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  // Show 270 degrees of arc (3/4 circle)
  const arcFraction = 0.75;
  const totalArc = circumference * arcFraction;
  const filledArc = totalArc * (percentage / 100);
  const emptyArc = totalArc - filledArc;

  let colorClass: string;
  if (percentage >= criticalThreshold) {
    colorClass = 'text-red-500';
  } else if (percentage >= warningThreshold) {
    colorClass = 'text-yellow-500';
  } else {
    colorClass = 'text-emerald-500';
  }

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform rotate-[135deg]"
      >
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${totalArc} ${circumference - totalArc}`}
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
        />
        {/* Filled arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filledArc} ${emptyArc + (circumference - totalArc)}`}
          className={`${colorClass} transition-all duration-300`}
          stroke="currentColor"
        />
      </svg>
      {/* Center value */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className={`text-lg font-bold ${colorClass}`}>
          {Math.round(clamped)}
        </span>
        <span className="text-[10px] text-gray-400">{unit}</span>
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1 -translate-y-2">
        {label}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// EmergencyStopButton
// ---------------------------------------------------------------------------

interface EmergencyStopButtonProps {
  onStop: () => void;
}

const EmergencyStopButton: React.FC<EmergencyStopButtonProps> = ({ onStop }) => {
  return (
    <button
      onClick={onStop}
      className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xl rounded-lg border-2 border-red-700 shadow-lg transition-all duration-150 flex items-center justify-center gap-3 animate-pulse hover:animate-none focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
    >
      <OctagonX className="w-7 h-7" />
      EMERGENCY STOP
      <OctagonX className="w-7 h-7" />
    </button>
  );
};

// ---------------------------------------------------------------------------
// CameraFeed
// ---------------------------------------------------------------------------

interface CameraFeedProps {
  onCapture: () => void;
  onStream: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture, onStream }) => {
  const [streaming, setStreaming] = useState(false);

  const handleStream = () => {
    setStreaming((prev) => !prev);
    onStream();
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        {streaming ? (
          <Camera className="w-4 h-4 text-emerald-500" />
        ) : (
          <CameraOff className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Camera Feed
        </span>
      </div>
      {/* 16:9 aspect container */}
      <div className="relative aspect-video bg-gray-800 dark:bg-gray-950 flex flex-col items-center justify-center">
        {/* Noise pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
        <CameraOff className="w-12 h-12 text-gray-500 mb-3" />
        <p className="text-sm text-gray-400">Camera feed unavailable</p>
        <p className="text-xs text-gray-500 mt-1">
          Connect to robot to enable camera
        </p>
      </div>
      <div className="p-3 flex gap-2">
        <button
          onClick={onCapture}
          className="flex-1 py-2 px-3 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Capture Frame
        </button>
        <button
          onClick={handleStream}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            streaming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          }`}
        >
          {streaming ? 'Stop Stream' : 'Start Stream'}
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VirtualJoystick
// ---------------------------------------------------------------------------

interface VirtualJoystickProps {
  keys: { up: boolean; down: boolean; left: boolean; right: boolean };
  speed: number;
  onSpeedChange: (speed: number) => void;
  onDirectionPress: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
  onDirectionRelease: () => void;
}

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  keys,
  speed,
  onSpeedChange,
  onDirectionPress,
  onDirectionRelease,
}) => {
  const btnBase =
    'w-14 h-14 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-purple-400 select-none';
  const btnInactive =
    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';
  const btnActive =
    'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-95';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <ChevronUp className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Virtual Joystick
        </span>
        <span className="ml-auto text-xs text-gray-400">WASD or Arrow Keys</span>
      </div>

      {/* 3x3 direction grid */}
      <div className="flex flex-col items-center gap-2 mb-4">
        {/* Row 1: Up */}
        <div className="flex gap-2">
          <div className="w-14 h-14" />
          <button
            className={`${btnBase} ${keys.up ? btnActive : btnInactive}`}
            onMouseDown={() => onDirectionPress('forward')}
            onMouseUp={onDirectionRelease}
            onMouseLeave={onDirectionRelease}
            aria-label="Forward"
          >
            <div className="flex flex-col items-center">
              <ArrowUp className="w-5 h-5" />
              <span className="text-[10px]">W</span>
            </div>
          </button>
          <div className="w-14 h-14" />
        </div>
        {/* Row 2: Left, Down, Right */}
        <div className="flex gap-2">
          <button
            className={`${btnBase} ${keys.left ? btnActive : btnInactive}`}
            onMouseDown={() => onDirectionPress('left')}
            onMouseUp={onDirectionRelease}
            onMouseLeave={onDirectionRelease}
            aria-label="Left"
          >
            <div className="flex flex-col items-center">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-[10px]">A</span>
            </div>
          </button>
          <button
            className={`${btnBase} ${keys.down ? btnActive : btnInactive}`}
            onMouseDown={() => onDirectionPress('backward')}
            onMouseUp={onDirectionRelease}
            onMouseLeave={onDirectionRelease}
            aria-label="Backward"
          >
            <div className="flex flex-col items-center">
              <ArrowDown className="w-5 h-5" />
              <span className="text-[10px]">S</span>
            </div>
          </button>
          <button
            className={`${btnBase} ${keys.right ? btnActive : btnInactive}`}
            onMouseDown={() => onDirectionPress('right')}
            onMouseUp={onDirectionRelease}
            onMouseLeave={onDirectionRelease}
            aria-label="Right"
          >
            <div className="flex flex-col items-center">
              <ArrowRight className="w-5 h-5" />
              <span className="text-[10px]">D</span>
            </div>
          </button>
        </div>
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="speed-slider"
          className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap"
        >
          Speed:
        </label>
        <input
          id="speed-slider"
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-purple-600"
        />
        <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400 w-10 text-right">
          {speed}%
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// TelemetryPanel
// ---------------------------------------------------------------------------

interface TelemetryPanelProps {
  speedPct: number;
  directionDeg: number;
  batteryPct: number;
  temperatureC: number;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  speedPct,
  directionDeg,
  batteryPct,
  temperatureC,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Telemetry Gauges
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative flex justify-center">
          <TelemetryGauge
            value={speedPct}
            max={100}
            label="Speed"
            unit="%"
            warningThreshold={70}
            criticalThreshold={90}
          />
        </div>
        <div className="relative flex justify-center">
          <TelemetryGauge
            value={directionDeg}
            max={360}
            label="Direction"
            unit="deg"
            warningThreshold={101}
            criticalThreshold={101}
          />
        </div>
        <div className="relative flex justify-center">
          <TelemetryGauge
            value={batteryPct}
            max={100}
            label="Battery"
            unit="%"
            warningThreshold={40}
            criticalThreshold={75}
          />
        </div>
        <div className="relative flex justify-center">
          <TelemetryGauge
            value={temperatureC}
            max={80}
            label="Temperature"
            unit="C"
            warningThreshold={62}
            criticalThreshold={87}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CommandHistory
// ---------------------------------------------------------------------------

interface CommandHistoryProps {
  entries: CommandEntry[];
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ entries }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Command History
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 max-h-48 font-mono text-xs leading-relaxed"
      >
        {entries.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No commands yet</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-2 text-gray-600 dark:text-gray-400"
            >
              <span className="text-gray-400 dark:text-gray-500 shrink-0">
                {entry.timestamp}
              </span>
              <span
                className={`font-semibold uppercase ${
                  entry.direction === 'stop'
                    ? 'text-red-500'
                    : 'text-emerald-500 dark:text-emerald-400'
                }`}
              >
                {entry.direction}
              </span>
              {entry.direction !== 'stop' && (
                <span className="text-gray-500">{entry.speed}%</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// RobotControlPage (main export)
// ---------------------------------------------------------------------------

export const RobotControlPage: React.FC = () => {
  const [speed, setSpeed] = useState(50);
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([]);
  const nextIdRef = useRef(1);
  const activeDirectionRef = useRef<string | null>(null);

  const { keys, isActive } = useGamepad();
  const { telemetry } = useRobotTelemetry();

  // ---- Derived telemetry values (from live data or mock defaults) ----

  const speedPct = telemetry
    ? Math.round(
        (Math.abs(telemetry.motors.left.dutyPercent) +
          Math.abs(telemetry.motors.right.dutyPercent)) /
          2,
      )
    : 0;

  const directionDeg = telemetry
    ? Math.round(
        ((telemetry.motors.right.dutyPercent - telemetry.motors.left.dutyPercent + 100) /
          200) *
          360,
      )
    : 0;

  const batteryPct = telemetry ? Math.round(telemetry.battery.percent) : 78;

  const temperatureC = telemetry
    ? Math.round(telemetry.system.cpuTemperatureC)
    : 42;

  // ---- Command logging ----

  const logCommand = useCallback(
    (direction: string, cmdSpeed: number) => {
      const entry: CommandEntry = {
        id: nextIdRef.current++,
        timestamp: formatTime(new Date()),
        direction,
        speed: cmdSpeed,
      };
      setCommandHistory((prev) => {
        const next = [...prev, entry];
        return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
      });
    },
    [],
  );

  // ---- Keyboard-driven movement via useGamepad ----

  useEffect(() => {
    let direction: 'forward' | 'backward' | 'left' | 'right' | 'stop' = 'stop';

    if (keys.up) direction = 'forward';
    else if (keys.down) direction = 'backward';
    else if (keys.left) direction = 'left';
    else if (keys.right) direction = 'right';

    const directionStr = direction as string;

    if (directionStr !== activeDirectionRef.current) {
      activeDirectionRef.current = directionStr;
      const cmdSpeed = direction === 'stop' ? 0 : speed;
      moveRobot(direction, cmdSpeed).catch(() => {
        // Silently handle API errors for now
      });
      logCommand(direction, cmdSpeed);
    }
  }, [keys, speed, logCommand]);

  // ---- Button-driven movement ----

  const handleDirectionPress = useCallback(
    (direction: 'forward' | 'backward' | 'left' | 'right') => {
      activeDirectionRef.current = direction;
      moveRobot(direction, speed).catch(() => {});
      logCommand(direction, speed);
    },
    [speed, logCommand],
  );

  const handleDirectionRelease = useCallback(() => {
    if (!isActive) {
      activeDirectionRef.current = 'stop';
      moveRobot('stop', 0).catch(() => {});
      logCommand('stop', 0);
    }
  }, [isActive, logCommand]);

  // ---- Emergency stop ----

  const handleEmergencyStop = useCallback(() => {
    activeDirectionRef.current = 'stop';
    moveRobot('stop', 0).catch(() => {});
    logCommand('EMERGENCY STOP', 0);
  }, [logCommand]);

  // ---- Camera ----

  const handleCameraCapture = useCallback(() => {
    controlCamera('capture').catch(() => {});
    logCommand('CAPTURE', 0);
  }, [logCommand]);

  const handleCameraStream = useCallback(() => {
    controlCamera('startStream').catch(() => {});
    logCommand('STREAM_TOGGLE', 0);
  }, [logCommand]);

  // ---- Render ----

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      {/* Emergency Stop */}
      <EmergencyStopButton onStop={handleEmergencyStop} />

      {/* Main content: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left column (60% = 3/5) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <CameraFeed
            onCapture={handleCameraCapture}
            onStream={handleCameraStream}
          />
          <VirtualJoystick
            keys={keys}
            speed={speed}
            onSpeedChange={setSpeed}
            onDirectionPress={handleDirectionPress}
            onDirectionRelease={handleDirectionRelease}
          />
        </div>

        {/* Right column (40% = 2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <TelemetryPanel
            speedPct={speedPct}
            directionDeg={directionDeg}
            batteryPct={batteryPct}
            temperatureC={temperatureC}
          />
          <CommandHistory entries={commandHistory} />
        </div>
      </div>
    </div>
  );
};
