import React from 'react';

const HOVER_COLOR = '#3b82f6';
const HOVER_INTENSITY = 0.15;
const PCB_GREEN = '#065f46';

interface JetsonNanoProps {
  isHovered: boolean;
  isSelected: boolean;
}

export const JetsonNano: React.FC<JetsonNanoProps> = ({ isHovered }) => {
  const emissive = isHovered ? HOVER_COLOR : '#000000';
  const emissiveIntensity = isHovered ? HOVER_INTENSITY : 0;

  return (
    <group>
      {/* Main PCB board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.1, 1.8]} />
        <meshStandardMaterial
          color={PCB_GREEN}
          roughness={0.6}
          metalness={0.3}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Heatsink */}
      <mesh position={[0.2, 0.18, 0]} castShadow>
        <boxGeometry args={[0.8, 0.25, 0.8]} />
        <meshStandardMaterial
          color="#a8a29e"
          roughness={0.3}
          metalness={0.7}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Heatsink fins */}
      {[-0.24, -0.08, 0.08, 0.24].map((z, i) => (
        <mesh key={i} position={[0.2, 0.32, z]} castShadow>
          <boxGeometry args={[0.78, 0.02, 0.06]} />
          <meshStandardMaterial
            color="#a8a29e"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* USB ports (side) */}
      {[0.3, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.08, -0.92]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.14]} />
          <meshStandardMaterial
            color="#71717a"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* Ethernet port */}
      <mesh position={[-0.5, 0.1, -0.92]} castShadow>
        <boxGeometry args={[0.22, 0.16, 0.18]} />
        <meshStandardMaterial
          color="#52525b"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* GPIO pin header */}
      <mesh position={[0, 0.1, 0.85]} castShadow>
        <boxGeometry args={[1.6, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* CSI connector */}
      <mesh position={[-0.7, 0.08, 0.3]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.3]} />
        <meshStandardMaterial
          color="#f5f5f4"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
};
