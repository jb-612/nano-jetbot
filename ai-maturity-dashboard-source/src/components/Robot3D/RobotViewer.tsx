import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6b7280" wireframe />
    </mesh>
  );
}

interface RobotViewerProps {
  children: React.ReactNode;
}

export const RobotViewer: React.FC<RobotViewerProps> = ({ children }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        // Deselect when clicking empty space - handled by parent
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </Canvas>
  );
};
