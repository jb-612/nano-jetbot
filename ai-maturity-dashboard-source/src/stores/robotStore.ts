import { create } from 'zustand';
import type { RobotPart } from '../models/robot-part';
import type { Material } from '../models/material';
import type { AssemblyState } from '../models/robot-assembly';
import { createInitialAssemblyState, assemblyReducer } from '../models/robot-assembly';
import type { AssemblyAction } from '../models/robot-assembly';
import { ROBOT_PARTS, ROBOT_PARTS_MAP } from '../data/robot-parts.data';
import { MATERIALS_MAP } from '../data/materials.data';
import { DEPENDENCY_GRAPH } from '../data/dependency-graph.data';
import { getAffectedParts } from '../services/dependency-graph.service';

interface RobotStore {
  // Parts data
  parts: RobotPart[];
  partsMap: Map<string, RobotPart>;
  materialsMap: Map<string, Material>;

  // Assembly state
  assembly: AssemblyState;
  dispatch: (action: AssemblyAction) => void;

  // Hover state (separate from assembly for performance)
  hoveredPartId: string | null;
  setHoveredPartId: (id: string | null) => void;

  // Computed
  getSelectedPart: () => RobotPart | null;
  getPartMaterials: (partId: string) => Material[];
  getDetachedParts: () => RobotPart[];
  getImpactedPartIds: (partId: string) => string[];
}

export const useRobotStore = create<RobotStore>((set, get) => ({
  parts: ROBOT_PARTS,
  partsMap: ROBOT_PARTS_MAP,
  materialsMap: MATERIALS_MAP,

  assembly: createInitialAssemblyState(),
  dispatch: (action) =>
    set((state) => ({ assembly: assemblyReducer(state.assembly, action) })),

  hoveredPartId: null,
  setHoveredPartId: (id) => set({ hoveredPartId: id }),

  getSelectedPart: () => {
    const { assembly, partsMap } = get();
    if (!assembly.selectedPartId) return null;
    return partsMap.get(assembly.selectedPartId) ?? null;
  },

  getPartMaterials: (partId: string) => {
    const { partsMap, materialsMap } = get();
    const part = partsMap.get(partId);
    if (!part) return [];
    return part.materialIds
      .map((id) => materialsMap.get(id))
      .filter((m): m is Material => m !== undefined);
  },

  getDetachedParts: () => {
    const { assembly, partsMap } = get();
    return [...assembly.detachedPartIds]
      .map((id) => partsMap.get(id))
      .filter((p): p is RobotPart => p !== undefined);
  },

  getImpactedPartIds: (partId: string) => {
    return getAffectedParts(DEPENDENCY_GRAPH, partId);
  },
}));
