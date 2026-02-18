import React from 'react';

type Criticality = 'critical' | 'high' | 'medium' | 'low';

const STYLES: Record<Criticality, string> = {
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

interface CriticalityBadgeProps {
  criticality: Criticality;
}

export const CriticalityBadge: React.FC<CriticalityBadgeProps> = ({ criticality }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${STYLES[criticality]}`}
    >
      {criticality}
    </span>
  );
};
