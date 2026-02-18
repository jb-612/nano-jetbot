import React from 'react';
import { RoundedBox } from '@react-three/drei';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface BatteryPackProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const BatteryPack: React.FC<BatteryPackProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* Battery housing */}
      <RoundedBox args={[1.6, 0.45, 1.1]} radius={0.04} castShadow receiveShadow>
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          metalness={0.2}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>

      {/* Battery cell bumps (two 18650 cells visible) */}
      <mesh position={[-0.3, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.9, 12]} />
        <meshStandardMaterial
          color="#292524"
          roughness={0.6}
          metalness={0.2}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[0.3, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.9, 12]} />
        <meshStandardMaterial
          color="#292524"
          roughness={0.6}
          metalness={0.2}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Power connector */}
      <mesh position={[0.82, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.25]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Status LED */}
      <mesh position={[-0.7, 0.24, 0.4]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};
