import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { damp3 } from 'maath/easing';
import type { Group } from 'three';
import type { Vector3Tuple } from 'three';

export function usePartAnimation(target: Vector3Tuple, smoothTime = 0.25) {
  const ref = useRef<Group>(null!);

  useFrame((_, delta) => {
    if (!ref.current) return;
    damp3(ref.current.position, target, smoothTime, delta);
  });

  return ref;
}
