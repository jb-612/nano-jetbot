import React from 'react';
import { usePartSelection } from '../../hooks/use-part-selection';
import { useRobotAssembly } from '../../hooks/use-robot-assembly';
import { useRobotStore } from '../../stores/robotStore';
import { CriticalityBadge } from './CriticalityBadge';
import { PartBadge } from './PartBadge';
import { X, Unplug, Plug, Info, Cpu, Zap, Link } from 'lucide-react';
import type { Material } from '../../models/material';

function formatConductivity(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} MS/m`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)} kS/m`;
  if (value >= 1) return `${value.toFixed(1)} S/m`;
  return `${value.toExponential(1)} S/m`;
}

function MaterialsTable({ materials }: { materials: Material[] }) {
  if (materials.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th className="pb-1 pr-2">Material</th>
            <th className="pb-1 pr-2">Electrical</th>
            <th className="pb-1">Thermal</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-1 pr-2 font-medium text-gray-900 dark:text-white">{m.name}</td>
              <td className="py-1 pr-2 text-gray-600 dark:text-gray-400">
                {formatConductivity(m.electricalConductivity.valueSiemensPerMeter)}
                <span className="ml-1 text-[10px] text-gray-400">
                  ({m.electricalConductivity.classification})
                </span>
              </td>
              <td className="py-1 text-gray-600 dark:text-gray-400">
                {m.thermalConductivity.valueWattsPerMeterKelvin} W/mK
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const PartInfoPanel: React.FC = () => {
  const { selectedPart, selectedPartMaterials, selectPart } = usePartSelection();
  const { isDetached, detachPart, attachPart } = useRobotAssembly();
  const partsMap = useRobotStore((s) => s.partsMap);

  if (!selectedPart) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div>
          <Info className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click on a part to view its details
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Double-click to detach/attach
          </p>
        </div>
      </div>
    );
  }

  const detached = isDetached(selectedPart.id);
  const connectedParts = selectedPart.connectedPartIds
    .map((id) => partsMap.get(id))
    .filter(Boolean);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedPart.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <PartBadge category={selectedPart.category} />
            <CriticalityBadge criticality={selectedPart.criticality} />
          </div>
        </div>
        <button
          onClick={() => selectPart(null)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {selectedPart.description}
      </p>

      {/* Function */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Cpu className="w-3.5 h-3.5 text-gray-500" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Function
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedPart.functionDescription}
        </p>
      </div>

      {/* Materials */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-gray-500" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Materials
          </h4>
        </div>
        <MaterialsTable materials={selectedPartMaterials} />
      </div>

      {/* Electrical */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 dark:text-gray-400">Resistance</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {selectedPart.electricalResistance.valueOhms >= 1e6
              ? `${(selectedPart.electricalResistance.valueOhms / 1e6).toFixed(0)} M\u03A9`
              : `${selectedPart.electricalResistance.valueOhms} \u03A9`}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 dark:text-gray-400">Weight</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {selectedPart.weightGrams}g
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 dark:text-gray-400">Dimensions</div>
          <div className="font-medium text-gray-900 dark:text-white text-xs">
            {selectedPart.dimensions.lengthMm}x{selectedPart.dimensions.widthMm}x
            {selectedPart.dimensions.heightMm}mm
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 dark:text-gray-400">Electrical Path</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {selectedPart.electricalResistance.isOnElectricalPath ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Connected Parts */}
      {connectedParts.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Link className="w-3.5 h-3.5 text-gray-500" />
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Connected Parts
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {connectedParts.map((part) => (
              <button
                key={part!.id}
                onClick={() => selectPart(part!.id)}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-400 transition-colors"
              >
                {part!.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detach/Attach button */}
      {selectedPart.isRemovable && (
        <button
          onClick={() =>
            detached ? attachPart(selectedPart.id) : detachPart(selectedPart.id)
          }
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            detached
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {detached ? (
            <>
              <Plug className="w-4 h-4" />
              Attach Part
            </>
          ) : (
            <>
              <Unplug className="w-4 h-4" />
              Detach Part
            </>
          )}
        </button>
      )}
    </div>
  );
};
