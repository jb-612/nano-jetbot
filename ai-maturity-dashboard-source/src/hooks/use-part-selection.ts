import { useCallback } from 'react';
import { useRobotStore } from '../stores/robotStore';

export function usePartSelection() {
  const selectedPartId = useRobotStore((s) => s.assembly.selectedPartId);
  const hoveredPartId = useRobotStore((s) => s.hoveredPartId);
  const setHoveredPartId = useRobotStore((s) => s.setHoveredPartId);
  const dispatch = useRobotStore((s) => s.dispatch);
  const getSelectedPart = useRobotStore((s) => s.getSelectedPart);
  const getPartMaterials = useRobotStore((s) => s.getPartMaterials);

  const selectPart = useCallback(
    (partId: string | null) => dispatch({ type: 'SELECT_PART', partId }),
    [dispatch],
  );

  const selectedPart = getSelectedPart();
  const selectedPartMaterials = selectedPart
    ? getPartMaterials(selectedPart.id)
    : [];

  return {
    selectedPartId,
    selectedPart,
    selectedPartMaterials,
    hoveredPartId,
    selectPart,
    setHoveredPartId,
  };
}
