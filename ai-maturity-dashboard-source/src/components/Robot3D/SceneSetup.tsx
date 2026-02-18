import React from 'react';
import { Environment, OrbitControls, Grid } from '@react-three/drei';
import { useThemeInCanvas } from './hooks/useThemeInCanvas';

export const SceneSetup: React.FC = () => {
  const isDark = useThemeInCanvas();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <pointLight position={[-5, 3, 5]} intensity={0.3} />

      <Environment preset="studio" />

      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={isDark ? '#374151' : '#d1d5db'}
        sectionSize={2}
        sectionThickness={1}
        sectionColor={isDark ? '#4b5563' : '#9ca3af'}
        fadeDistance={15}
        infiniteGrid
      />

      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -0.02, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={isDark ? '#1f2937' : '#f3f4f6'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={20}
        target={[0, 1, 0]}
      />
    </>
  );
};
