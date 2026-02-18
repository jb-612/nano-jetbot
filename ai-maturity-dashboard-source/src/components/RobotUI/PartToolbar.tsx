import React from 'react';
import { useRobotAssembly } from '../../hooks/use-robot-assembly';
import { usePartSelection } from '../../hooks/use-part-selection';
import { useRobotStore } from '../../stores/robotStore';
import { RotateCcw, Expand, ChevronRight } from 'lucide-react';

export const PartToolbar: React.FC = () => {
  const { assembly, toggleExplode, reset } = useRobotAssembly();
  const { selectPart, selectedPartId } = usePartSelection();
  const parts = useRobotStore((s) => s.parts);

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Action buttons */}
      <div className="flex items-center gap-1.5 mr-3">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Reset view"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={toggleExplode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            assembly.isExploded
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Toggle exploded view"
        >
          <Expand className="w-3.5 h-3.5" />
          {assembly.isExploded ? 'Collapse' : 'Explode'}
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Part chips - horizontal scroll */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-1">
          {parts.map((part) => {
            const isSelected = selectedPartId === part.id;
            const isDetached = assembly.detachedPartIds.has(part.id);

            return (
              <button
                key={part.id}
                onClick={() => selectPart(part.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isDetached
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {part.name}
                {isDetached && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  );
};
