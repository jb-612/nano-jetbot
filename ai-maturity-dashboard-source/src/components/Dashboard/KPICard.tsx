import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    target: string | number;
    trend: 'up' | 'down' | 'neutral';
    trendValue: string;
    unit?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    target,
    trend,
    trendValue,
    unit = ''
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
                {title}
            </h3>

            <div className="flex items-end mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white mr-2">
                    {value}{unit}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    / {target}{unit} Target
                </span>
            </div>

            <div className="flex items-center">
                <div className={`flex items-center text-sm font-medium mr-3 px-2 py-0.5 rounded ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                    {trendValue}
                </div>
                <span className="text-xs text-gray-400">vs last month</span>
            </div>
        </div>
    );
};
