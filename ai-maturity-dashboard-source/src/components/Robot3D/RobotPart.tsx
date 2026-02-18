import React, { useCallback } from 'react';
import { useRobotStore } from '../../stores/robotStore';
import { usePartAnimation } from './hooks/usePartAnimation';
import type { Vector3Tuple } from 'three';
import type { ThreeEvent } from '@react-three/fiber';

interface RobotPartProps {
  partId: string;
  basePosition: Vector3Tuple;
  detachedOffset: Vector3Tuple;
  children: (state: { isHovered: boolean; isSelected: boolean }) => React.ReactNode;
}

export const RobotPart: React.FC<RobotPartProps> = ({
  partId,
  basePosition,
  detachedOffset,
  children,
}) => {
  const dispatch = useRobotStore((s) => s.dispatch);
  const isDetached = useRobotStore((s) => s.assembly.detachedPartIds.has(partId));
  const isSelected = useRobotStore((s) => s.assembly.selectedPartId === partId);
  const isHovered = useRobotStore((s) => s.hoveredPartId === partId);
  const setHoveredPartId = useRobotStore((s) => s.setHoveredPartId);

  const targetPosition: Vector3Tuple = isDetached
    ? [
        basePosition[0] + detachedOffset[0],
        basePosition[1] + detachedOffset[1],
        basePosition[2] + detachedOffset[2],
      ]
    : basePosition;

  const groupRef = usePartAnimation(targetPosition);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_PART', partId });
    },
    [dispatch, partId],
  );

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (isDetached) {
        dispatch({ type: 'ATTACH_PART', partId });
      } else {
        dispatch({ type: 'DETACH_PART', partId });
      }
    },
    [dispatch, partId, isDetached],
  );

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredPartId(partId);
      document.body.style.cursor = 'pointer';
    },
    [setHoveredPartId, partId],
  );

  const handlePointerOut = useCallback(
    () => {
      setHoveredPartId(null);
      document.body.style.cursor = 'auto';
    },
    [setHoveredPartId],
  );

  return (
    <group
      ref={groupRef}
      position={basePosition}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children({ isHovered, isSelected })}
    </group>
  );
};
