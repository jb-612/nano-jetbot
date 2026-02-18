import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface CasterBallProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const CasterBall: React.FC<CasterBallProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* Bracket */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.25, 0.18, 0.25]} />
        <meshStandardMaterial
          color="#a1a1aa"
          roughness={0.4}
          metalness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Ball */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color="#9ca3af"
          roughness={0.2}
          metalness={0.8}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
