export type PartCategory = 'structural' | 'compute' | 'power' | 'locomotion' | 'sensor' | 'communication' | 'electrical' | 'wiring';
export type Criticality = 'critical' | 'high' | 'medium' | 'low';

export interface RobotPart {
  id: string;
  name: string;
  description: string;
  category: PartCategory;
  functionDescription: string;
  materialIds: string[];
  electricalResistance: { valueOhms: number; isOnElectricalPath: boolean };
  criticality: Criticality;
  weightGrams: number;
  dimensions: { lengthMm: number; widthMm: number; heightMm: number };
  connectedPartIds: string[];
  dependsOnPartIds: string[];
  isRemovable: boolean;
}
