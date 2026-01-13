import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { KPICard } from '../components/Dashboard/KPICard';

export const MaturityKPIs: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
                <Link to="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maturity KPIs</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <KPICard
                    title="Adoption Percentage"
                    value={42}
                    target={80}
                    unit="%"
                    trend="up"
                    trendValue="+5.2%"
                />
                <KPICard
                    title="Active Users"
                    value={1250}
                    target={2000}
                    trend="up"
                    trendValue="+12%"
                />
                <KPICard
                    title="Training Completion"
                    value={68}
                    target={95}
                    unit="%"
                    trend="up"
                    trendValue="+3.1%"
                />
                <KPICard
                    title="AI Projects Deployed"
                    value={14}
                    target={20}
                    trend="neutral"
                    trendValue="0"
                />
                <KPICard
                    title="Development Velocity"
                    value={8.5}
                    target={10}
                    unit=" pts"
                    trend="up"
                    trendValue="+0.5"
                />
                <KPICard
                    title="Quality Score"
                    value={92}
                    target={95}
                    unit="%"
                    trend="down"
                    trendValue="-1.2%"
                />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/50">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">KPI Summary</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Overall adoption is tracking well against Q1 targets. Focus areas should include increasing training completion rates within the Operations division to boost the overall readiness score.
                </p>
            </div>
        </div>
    );
};
