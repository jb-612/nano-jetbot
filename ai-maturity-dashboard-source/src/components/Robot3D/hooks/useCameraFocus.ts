import { useFrame, useThree } from '@react-three/fiber';
import { damp3 } from 'maath/easing';
import type { Vector3Tuple } from 'three';

const DEFAULT_TARGET: Vector3Tuple = [0, 1, 0];

export function useCameraFocus(target: Vector3Tuple | null, smoothTime = 0.5) {
  const { controls } = useThree();
  const dest = target ?? DEFAULT_TARGET;

  useFrame((_, delta) => {
    if (!controls) return;
    const orbitControls = controls as unknown as { target: { x: number; y: number; z: number } };
    if (orbitControls.target) {
      damp3(orbitControls.target, dest, smoothTime, delta);
    }
  });
}
