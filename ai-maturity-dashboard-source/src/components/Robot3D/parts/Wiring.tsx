import React, { useMemo } from 'react';
import { QuadraticBezierLine } from '@react-three/drei';
import type { Vector3Tuple } from 'three';

const HOVER_COLOR = '#3b82f6';

interface WiringProps {
  isHovered: boolean;
  isSelected: boolean;
}

interface CableDef {
  start: Vector3Tuple;
  mid: Vector3Tuple;
  end: Vector3Tuple;
  color: string;
}

export const Wiring: React.FC<WiringProps> = ({ isHovered }) => {
  const cables = useMemo<CableDef[]>(() => [
    // Power: battery to Jetson (red)
    { start: [0.5, 0, -0.2], mid: [0.6, 0.3, -0.1], end: [0.5, 0.6, 0], color: '#dc2626' },
    // Ground: battery to motor driver (black)
    { start: [-0.5, 0, -0.2], mid: [-0.6, 0.2, -0.4], end: [-0.4, 0, -0.6], color: '#171717' },
    // I2C data: Jetson to motor driver (yellow)
    { start: [0.3, 0.6, 0.3], mid: [0.4, 0.4, 0.1], end: [0.3, 0, -0.3], color: '#eab308' },
    // Motor left (blue)
    { start: [-0.5, 0, -0.5], mid: [-0.8, -0.1, -0.3], end: [-1.1, 0, -0.2], color: '#2563eb' },
    // Motor right (orange)
    { start: [0.5, 0, -0.5], mid: [0.8, -0.1, -0.3], end: [1.1, 0, -0.2], color: '#ea580c' },
    // CSI ribbon to camera (white)
    { start: [-0.4, 0.6, 0.2], mid: [-0.3, 0.8, 0.6], end: [0, 0.9, 0.9], color: '#e5e7eb' },
  ], []);

  return (
    <group>
      {cables.map((cable, i) => (
        <QuadraticBezierLine
          key={i}
          start={cable.start}
          mid={cable.mid}
          end={cable.end}
          lineWidth={2.5}
          color={isHovered ? HOVER_COLOR : cable.color}
        />
      ))}
    </group>
  );
};
