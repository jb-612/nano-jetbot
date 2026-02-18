import type { DependencyGraph, ImpactAnalysis } from '../models/dependency-graph';
import type { RobotPart } from '../models/robot-part';

/**
 * Get all parts affected by removing a specific part.
 * Uses BFS from removedPartId, following edges where fromPartId matches.
 */
export function getAffectedParts(
  graph: DependencyGraph,
  removedPartId: string,
): string[] {
  const affected: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [removedPartId];
  visited.add(removedPartId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    for (const edge of graph.edges) {
      if (edge.fromPartId === currentId && !visited.has(edge.toPartId)) {
        visited.add(edge.toPartId);
        affected.push(edge.toPartId);
        queue.push(edge.toPartId);
      }
    }
  }

  return affected;
}

/**
 * Produce a full impact analysis for removing a part, including severity
 * assessment based on the criticality of affected parts.
 */
export function getImpactAnalysis(
  graph: DependencyGraph,
  parts: RobotPart[],
  removedPartId: string,
): ImpactAnalysis {
  const affectedPartIds = getAffectedParts(graph, removedPartId);

  if (affectedPartIds.length === 0) {
    return {
      removedPartId,
      affectedPartIds: [],
      severityLevel: 'none',
      description: 'Removing this part has no downstream impact.',
    };
  }

  const partsMap = new Map(parts.map((p) => [p.id, p]));
  const affectedParts = affectedPartIds
    .map((id) => partsMap.get(id))
    .filter((p): p is RobotPart => p !== undefined);

  const hasCritical = affectedParts.some((p) => p.criticality === 'critical');
  const hasHigh = affectedParts.some((p) => p.criticality === 'high');

  let severityLevel: ImpactAnalysis['severityLevel'];
  let description: string;

  if (hasCritical) {
    severityLevel = 'non-functional';
    description = `Removing this part affects ${affectedPartIds.length} part(s), including critical components. The robot will be non-functional.`;
  } else if (hasHigh) {
    severityLevel = 'degraded';
    description = `Removing this part affects ${affectedPartIds.length} part(s), including high-priority components. The robot will operate in a degraded state.`;
  } else {
    severityLevel = 'degraded';
    description = `Removing this part affects ${affectedPartIds.length} part(s). The robot may experience reduced capability.`;
  }

  return {
    removedPartId,
    affectedPartIds,
    severityLevel,
    description,
  };
}

/**
 * Get the full dependency chain (all ancestors) for a given part.
 * These are the parts that the specified part depends on, traversed recursively
 * by following edges where toPartId matches.
 */
export function getDependencyChain(
  graph: DependencyGraph,
  partId: string,
): string[] {
  const ancestors: string[] = [];
  const visited = new Set<string>();
  const queue: string[] = [partId];
  visited.add(partId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    for (const edge of graph.edges) {
      if (edge.toPartId === currentId && !visited.has(edge.fromPartId)) {
        visited.add(edge.fromPartId);
        ancestors.push(edge.fromPartId);
        queue.push(edge.fromPartId);
      }
    }
  }

  return ancestors;
}

/**
 * Produce a topological ordering of the given part IDs based on the dependency
 * graph. The returned order is safe for sequential removal (dependents first).
 */
export function topologicalSort(
  graph: DependencyGraph,
  partIds: string[],
): string[] {
  const partIdSet = new Set(partIds);

  // Build adjacency list and in-degree map for the subgraph
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const id of partIds) {
    adjacency.set(id, []);
    inDegree.set(id, 0);
  }

  for (const edge of graph.edges) {
    if (partIdSet.has(edge.fromPartId) && partIdSet.has(edge.toPartId)) {
      adjacency.get(edge.fromPartId)!.push(edge.toPartId);
      inDegree.set(edge.toPartId, (inDegree.get(edge.toPartId) ?? 0) + 1);
    }
  }

  // Kahn's algorithm - start with nodes that have no incoming edges within the subgraph
  const queue: string[] = [];
  for (const id of partIds) {
    if ((inDegree.get(id) ?? 0) === 0) {
      queue.push(id);
    }
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If there are remaining nodes (cycle), append them at the end
  for (const id of partIds) {
    if (!sorted.includes(id)) {
      sorted.push(id);
    }
  }

  // Reverse so dependents come first (safe removal order)
  return sorted.reverse();
}

/**
 * Get the immediate dependents (children) of a part - parts that directly
 * depend on the given part.
 */
export function getDirectDependents(
  graph: DependencyGraph,
  partId: string,
): string[] {
  return graph.edges
    .filter((edge) => edge.fromPartId === partId)
    .map((edge) => edge.toPartId);
}

/**
 * Get the immediate dependencies (parents) of a part - parts that the given
 * part directly depends on.
 */
export function getDirectDependencies(
  graph: DependencyGraph,
  partId: string,
): string[] {
  return graph.edges
    .filter((edge) => edge.toPartId === partId)
    .map((edge) => edge.fromPartId);
}
