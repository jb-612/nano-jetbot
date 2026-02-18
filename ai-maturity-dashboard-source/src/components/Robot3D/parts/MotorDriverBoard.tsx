import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;

interface MotorDriverBoardProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const MotorDriverBoard: React.FC<MotorDriverBoardProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* PCB board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.08, 0.8]} />
        <meshStandardMaterial
          color="#7c3aed"
          roughness={0.6}
          metalness={0.3}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Capacitors */}
      {[-0.35, -0.15, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0.15]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 8]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* IC chip */}
      <mesh position={[0.25, 0.06, -0.1]} castShadow>
        <boxGeometry args={[0.25, 0.04, 0.25]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Terminal blocks (left and right for motors) */}
      <mesh position={[-0.55, 0.08, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#16a34a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.55, 0.08, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.5]} />
        <meshStandardMaterial
          color="#16a34a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Pin header */}
      <mesh position={[0, 0.06, -0.35]} castShadow>
        <boxGeometry args={[0.6, 0.06, 0.06]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};
