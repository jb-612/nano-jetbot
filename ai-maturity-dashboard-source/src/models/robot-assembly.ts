import type { RobotPart } from './robot-part';

export type AssemblyAction =
  | { type: 'DETACH_PART'; partId: string }
  | { type: 'ATTACH_PART'; partId: string }
  | { type: 'SELECT_PART'; partId: string | null }
  | { type: 'TOGGLE_EXPLODE' }
  | { type: 'RESET' };

export interface AssemblyState {
  detachedPartIds: Set<string>;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  isExploded: boolean;
}

export function createInitialAssemblyState(): AssemblyState {
  return {
    detachedPartIds: new Set(),
    selectedPartId: null,
    hoveredPartId: null,
    isExploded: false,
  };
}

export function assemblyReducer(state: AssemblyState, action: AssemblyAction): AssemblyState {
  switch (action.type) {
    case 'DETACH_PART':
      return { ...state, detachedPartIds: new Set([...state.detachedPartIds, action.partId]) };
    case 'ATTACH_PART': {
      const next = new Set(state.detachedPartIds);
      next.delete(action.partId);
      return { ...state, detachedPartIds: next };
    }
    case 'SELECT_PART':
      return { ...state, selectedPartId: action.partId };
    case 'TOGGLE_EXPLODE':
      return { ...state, isExploded: !state.isExploded };
    case 'RESET':
      return createInitialAssemblyState();
    default:
      return state;
  }
}
