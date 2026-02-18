import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface AntennaProps {
  side: 'left' | 'right';
  isHovered: boolean;
  isSelected: boolean;
}

export const Antenna: React.FC<AntennaProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* Base mount */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 8]} />
        <meshStandardMaterial
          color="#27272a"
          roughness={0.5}
          metalness={0.4}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Rod */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.7, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.4}
          metalness={0.5}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.4}
          metalness={0.5}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
