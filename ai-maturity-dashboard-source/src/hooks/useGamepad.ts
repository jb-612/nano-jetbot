import { useState, useEffect, useCallback } from 'react';

export interface GamepadKeys {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface UseGamepadResult {
  keys: GamepadKeys;
  isActive: boolean;
}

const KEY_MAP: Record<string, keyof GamepadKeys> = {
  w: 'up',
  W: 'up',
  ArrowUp: 'up',
  s: 'down',
  S: 'down',
  ArrowDown: 'down',
  a: 'left',
  A: 'left',
  ArrowLeft: 'left',
  d: 'right',
  D: 'right',
  ArrowRight: 'right',
};

export function useGamepad(): UseGamepadResult {
  const [keys, setKeys] = useState<GamepadKeys>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const direction = KEY_MAP[e.key];
    if (direction) {
      e.preventDefault();
      setKeys((prev) => ({ ...prev, [direction]: true }));
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const direction = KEY_MAP[e.key];
    if (direction) {
      e.preventDefault();
      setKeys((prev) => ({ ...prev, [direction]: false }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const isActive = keys.up || keys.down || keys.left || keys.right;

  return { keys, isActive };
}
