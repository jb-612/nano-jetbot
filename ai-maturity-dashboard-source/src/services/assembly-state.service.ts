import type { RobotPart } from '../models/robot-part';
import type { AssemblyState } from '../models/robot-assembly';

interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

interface AssemblyValidation {
  valid: boolean;
  errors: string[];
}

const CRITICALITY_ORDER: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

/**
 * Check whether a part can be safely detached from the assembly.
 * A part cannot be detached if it is not removable or if it is already
 * detached.
 */
export function canDetachPart(
  part: RobotPart,
  assembly: AssemblyState,
): ValidationResult {
  if (assembly.detachedPartIds.has(part.id)) {
    return { allowed: false, reason: 'Part is already detached.' };
  }

  if (!part.isRemovable) {
    return {
      allowed: false,
      reason: 'Part is not removable and cannot be detached.',
    };
  }

  return { allowed: true };
}

/**
 * Check whether a part can be re-attached to the assembly.
 * A part can only be attached if it is currently detached.
 */
export function canAttachPart(
  partId: string,
  assembly: AssemblyState,
): ValidationResult {
  if (!assembly.detachedPartIds.has(partId)) {
    return {
      allowed: false,
      reason: 'Part is not currently detached and cannot be attached.',
    };
  }

  return { allowed: true };
}

/**
 * Determine the order in which removable parts should animate during an
 * explode sequence. Parts are sorted by criticality (low first, critical last)
 * so less important parts fly out first.
 */
export function getExplodeSequence(parts: RobotPart[]): string[] {
  return parts
    .filter((part) => part.isRemovable)
    .sort(
      (a, b) =>
        (CRITICALITY_ORDER[a.criticality] ?? 0) -
        (CRITICALITY_ORDER[b.criticality] ?? 0),
    )
    .map((part) => part.id);
}

/**
 * Validate the current assembly state against the known parts list.
 * Returns any errors found such as references to unknown parts.
 */
export function validateAssemblyState(
  assembly: AssemblyState,
  parts: RobotPart[],
): AssemblyValidation {
  const errors: string[] = [];
  const knownIds = new Set(parts.map((p) => p.id));

  // Check that all detached part IDs reference known parts
  for (const detachedId of assembly.detachedPartIds) {
    if (!knownIds.has(detachedId)) {
      errors.push(
        `Detached part ID "${detachedId}" does not match any known part.`,
      );
    }
  }

  // Check that detached parts are actually removable
  const partsMap = new Map(parts.map((p) => [p.id, p]));
  for (const detachedId of assembly.detachedPartIds) {
    const part = partsMap.get(detachedId);
    if (part && !part.isRemovable) {
      errors.push(
        `Part "${part.name}" (${detachedId}) is marked as detached but is not removable.`,
      );
    }
  }

  // Check that the selected part ID references a known part
  if (assembly.selectedPartId !== null && !knownIds.has(assembly.selectedPartId)) {
    errors.push(
      `Selected part ID "${assembly.selectedPartId}" does not match any known part.`,
    );
  }

  // Check that the hovered part ID references a known part
  if (assembly.hoveredPartId !== null && !knownIds.has(assembly.hoveredPartId)) {
    errors.push(
      `Hovered part ID "${assembly.hoveredPartId}" does not match any known part.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
