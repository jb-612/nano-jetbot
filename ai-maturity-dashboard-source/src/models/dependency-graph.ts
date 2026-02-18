export interface DependencyEdge {
  fromPartId: string;
  toPartId: string;
  type: 'power' | 'data' | 'structural' | 'mechanical';
  description: string;
}

export interface DependencyGraph {
  edges: DependencyEdge[];
}

export interface ImpactAnalysis {
  removedPartId: string;
  affectedPartIds: string[];
  severityLevel: 'none' | 'degraded' | 'non-functional';
  description: string;
}
