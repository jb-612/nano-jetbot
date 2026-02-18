import type { RobotPart, PartCategory, Criticality } from '../models/robot-part';
import type { Material } from '../models/material';

/**
 * Find a part by its unique identifier.
 */
export function getPartById(
  parts: RobotPart[],
  id: string,
): RobotPart | undefined {
  return parts.find((part) => part.id === id);
}

/**
 * Filter parts by their category (structural, compute, power, etc.).
 */
export function getPartsByCategory(
  parts: RobotPart[],
  category: PartCategory,
): RobotPart[] {
  return parts.filter((part) => part.category === category);
}

/**
 * Filter parts by their criticality level.
 */
export function getPartsByCriticality(
  parts: RobotPart[],
  criticality: Criticality,
): RobotPart[] {
  return parts.filter((part) => part.criticality === criticality);
}

/**
 * Return only parts that are flagged as removable.
 */
export function getRemovableParts(parts: RobotPart[]): RobotPart[] {
  return parts.filter((part) => part.isRemovable);
}

/**
 * Search parts by matching a query string against name and description
 * (case-insensitive).
 */
export function searchParts(parts: RobotPart[], query: string): RobotPart[] {
  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery.length === 0) return parts;
  return parts.filter(
    (part) =>
      part.name.toLowerCase().includes(lowerQuery) ||
      part.description.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Calculate the total weight of the given parts in grams.
 */
export function getTotalWeight(parts: RobotPart[]): number {
  return parts.reduce((total, part) => total + part.weightGrams, 0);
}

/**
 * Get all parts that are directly connected to the specified part.
 */
export function getConnectedParts(
  parts: RobotPart[],
  partId: string,
): RobotPart[] {
  const part = parts.find((p) => p.id === partId);
  if (!part) return [];
  const connectedIds = new Set(part.connectedPartIds);
  return parts.filter((p) => connectedIds.has(p.id));
}

/**
 * Resolve a part's materialIds into their full Material objects.
 */
export function getPartMaterials(
  part: RobotPart,
  materialsMap: Map<string, Material>,
): Material[] {
  return part.materialIds
    .map((id) => materialsMap.get(id))
    .filter((m): m is Material => m !== undefined);
}
