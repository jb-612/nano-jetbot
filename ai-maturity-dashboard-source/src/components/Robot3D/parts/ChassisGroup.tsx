import React from 'react';
import { RoundedBox } from '@react-three/drei';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;
const GREEN = '#22c55e';

interface ChassisGroupProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const ChassisGroup: React.FC<ChassisGroupProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* Lower chassis plate */}
      <RoundedBox args={[3.2, 0.12, 2.5]} radius={0.08} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={GREEN}
          roughness={0.7}
          metalness={0.1}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>

      {/* Upper chassis plate */}
      <RoundedBox args={[3.2, 0.12, 2.5]} radius={0.08} position={[0, 0.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={GREEN}
          roughness={0.7}
          metalness={0.1}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>

      {/* Standoffs connecting plates */}
      {[
        [-1.3, 0.35, -1.0],
        [1.3, 0.35, -1.0],
        [-1.3, 0.35, 1.0],
        [1.3, 0.35, 1.0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.58, 8]} />
          <meshStandardMaterial
            color="#d4d4d8"
            roughness={0.3}
            metalness={0.7}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
    </group>
  );
};
