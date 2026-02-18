import { useCallback } from 'react';
import { useRobotStore } from '../stores/robotStore';

export function useRobotAssembly() {
  const dispatch = useRobotStore((s) => s.dispatch);
  const assembly = useRobotStore((s) => s.assembly);
  const parts = useRobotStore((s) => s.parts);

  const detachPart = useCallback(
    (partId: string) => dispatch({ type: 'DETACH_PART', partId }),
    [dispatch],
  );

  const attachPart = useCallback(
    (partId: string) => dispatch({ type: 'ATTACH_PART', partId }),
    [dispatch],
  );

  const selectPart = useCallback(
    (partId: string | null) => dispatch({ type: 'SELECT_PART', partId }),
    [dispatch],
  );

  const toggleExplode = useCallback(
    () => dispatch({ type: 'TOGGLE_EXPLODE' }),
    [dispatch],
  );

  const reset = useCallback(
    () => dispatch({ type: 'RESET' }),
    [dispatch],
  );

  const isDetached = useCallback(
    (partId: string) => assembly.detachedPartIds.has(partId),
    [assembly.detachedPartIds],
  );

  return {
    assembly,
    parts,
    detachPart,
    attachPart,
    selectPart,
    toggleExplode,
    reset,
    isDetached,
  };
}
