export interface Material {
  id: string;
  name: string;
  electricalConductivity: {
    valueSiemensPerMeter: number;
    classification: 'conductor' | 'semiconductor' | 'insulator';
  };
  thermalConductivity: {
    valueWattsPerMeterKelvin: number;
    classification: 'high' | 'medium' | 'low';
  };
  densityKgPerM3: number;
}
