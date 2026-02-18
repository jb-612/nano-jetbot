import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface CameraModuleProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const CameraModule: React.FC<CameraModuleProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* PCB body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.35, 0.08]} />
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.6}
          metalness={0.3}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lens housing */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.14, 20]} />
        <meshStandardMaterial
          color="#27272a"
          roughness={0.3}
          metalness={0.6}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Lens glass */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 20]} />
        <meshStandardMaterial
          color="#1e3a5f"
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ribbon cable */}
      <mesh position={[0, -0.1, -0.06]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial
          color="#f5f5f4"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* LED indicator */}
      <mesh position={[0.18, 0.12, 0.04]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};
