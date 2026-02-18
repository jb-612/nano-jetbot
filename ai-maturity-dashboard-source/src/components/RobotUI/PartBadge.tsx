import React from 'react';

type Category =
  | 'structural'
  | 'compute'
  | 'power'
  | 'locomotion'
  | 'sensor'
  | 'communication'
  | 'electrical'
  | 'wiring';

const STYLES: Record<Category, string> = {
  structural: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  compute: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  power: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  locomotion: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  sensor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  communication: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  electrical: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  wiring: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

interface PartBadgeProps {
  category: Category;
}

export const PartBadge: React.FC<PartBadgeProps> = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${STYLES[category]}`}
    >
      {category}
    </span>
  );
};
