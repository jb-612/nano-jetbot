import React from 'react';
import { BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center pt-16 min-h-[calc(100vh-theme(spacing.16))]">
            <div className="mb-8">
                {/* Logo placeholder if needed, or just text */}
                <img src="/amdocs-logo.svg" alt="Amdocs" className="h-12 mx-auto mb-8" />
            </div>

            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Amdocs AI Fitness</h1>
            <p className="text-gray-500 text-lg mb-16">Agentic AI Progress Status</p>

            <div className="grid grid-cols-2 gap-8 w-full max-w-5xl px-4">
                {/* Maturity Dashboard Card */}
                <div
                    onClick={() => navigate('/dashboard')}
                    className="group relative bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r"></div>

                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Maturity Dashboard
                    </h2>

                    <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 rounded p-2 inline-block">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Overall Score:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">58%</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
                        View overall maturity scores, explore maturity by area, and compare different buckets.
                        Get insights into your AI maturity journey across all key areas.
                    </p>

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>
                </div>

                {/* Maturity KPIs Card */}
                <div
                    onClick={() => navigate('/maturity-kpis')}
                    className="group relative bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-green-500 rounded-r"></div>

                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        Maturity KPIs
                    </h2>

                    <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 rounded p-2 inline-block">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Overall Score:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">56%</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
                        Track and monitor key performance indicators for AI maturity.
                        Analyze trends and measure progress across different maturity dimensions.
                    </p>

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};
