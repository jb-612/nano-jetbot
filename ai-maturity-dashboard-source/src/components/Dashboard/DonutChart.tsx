import React from 'react';

interface DonutChartProps {
    score: number;
    label: string;
    subLabel?: string;
    color?: string;
    size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
    score,
    label,
    subLabel,
    color = 'text-blue-600',
    size = 200
}) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                {/* Background Circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${color} transition-all duration-1000 ease-out`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${color}`}>{score}%</span>
                <span className="text-xs text-gray-500 font-medium mt-1">{label}</span>
                {subLabel && <span className="text-sm text-gray-400 mt-1">{subLabel}</span>}
            </div>
        </div>
    );
};
