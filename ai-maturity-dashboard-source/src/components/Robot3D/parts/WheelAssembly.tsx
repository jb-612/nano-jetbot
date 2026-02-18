import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface WheelAssemblyProps {
  side: 'left' | 'right';
  isHovered: boolean;
  isSelected: boolean;
}

export const WheelAssembly: React.FC<WheelAssemblyProps> = ({ side, isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;
  const rotZ = side === 'left' ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group rotation={[0, 0, rotZ]}>
      {/* Rim */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 24]} />
        <meshStandardMaterial
          color="#e5e7eb"
          roughness={0.3}
          metalness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Hub cap */}
      <mesh position={[0, side === 'left' ? -0.1 : 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshStandardMaterial
          color="#a1a1aa"
          roughness={0.2}
          metalness={0.8}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Tire */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.12, 12, 32]} />
        <meshStandardMaterial
          color="#333333"
          roughness={0.9}
          metalness={0.0}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
