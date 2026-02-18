import type { Material } from '../models/material';

export const MATERIALS: Material[] = [
  {
    id: 'mat-copper',
    name: 'Copper',
    electricalConductivity: {
      valueSiemensPerMeter: 5.96e7,
      classification: 'conductor',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 401,
      classification: 'high',
    },
    densityKgPerM3: 8960,
  },
  {
    id: 'mat-aluminum',
    name: 'Aluminum 6061',
    electricalConductivity: {
      valueSiemensPerMeter: 2.5e7,
      classification: 'conductor',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 167,
      classification: 'high',
    },
    densityKgPerM3: 2700,
  },
  {
    id: 'mat-silicon',
    name: 'Silicon (doped)',
    electricalConductivity: {
      valueSiemensPerMeter: 1e3,
      classification: 'semiconductor',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 149,
      classification: 'high',
    },
    densityKgPerM3: 2330,
  },
  {
    id: 'mat-pla',
    name: 'PLA Plastic',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-14,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 0.13,
      classification: 'low',
    },
    densityKgPerM3: 1240,
  },
  {
    id: 'mat-fr4',
    name: 'FR-4 PCB',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-12,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 0.25,
      classification: 'low',
    },
    densityKgPerM3: 1850,
  },
  {
    id: 'mat-rubber',
    name: 'Rubber (SBR)',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-13,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 0.16,
      classification: 'low',
    },
    densityKgPerM3: 1200,
  },
  {
    id: 'mat-steel',
    name: 'Stainless Steel 304',
    electricalConductivity: {
      valueSiemensPerMeter: 1.4e6,
      classification: 'conductor',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 16.2,
      classification: 'medium',
    },
    densityKgPerM3: 8000,
  },
  {
    id: 'mat-liion-casing',
    name: 'Li-Ion Casing',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-10,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 3.0,
      classification: 'medium',
    },
    densityKgPerM3: 2500,
  },
  {
    id: 'mat-pvc',
    name: 'PVC Insulation',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-14,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 0.19,
      classification: 'low',
    },
    densityKgPerM3: 1400,
  },
  {
    id: 'mat-glass',
    name: 'Optical Glass BK7',
    electricalConductivity: {
      valueSiemensPerMeter: 1e-12,
      classification: 'insulator',
    },
    thermalConductivity: {
      valueWattsPerMeterKelvin: 1.114,
      classification: 'low',
    },
    densityKgPerM3: 2510,
  },
];

export const MATERIALS_MAP: Map<string, Material> = new Map(
  MATERIALS.map((m) => [m.id, m]),
);
