import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import { DonutChart } from '../components/Dashboard/DonutChart';

export const MaturityDashboard: React.FC = () => {
    const buckets = [
        { id: 1, name: 'AI Strategy & Vision', score: 65, status: 'Advanced' },
        { id: 2, name: 'Data Readiness', score: 72, status: 'Advanced' },
        { id: 3, name: 'Technology Infrastructure', score: 45, status: 'Developing' },
        { id: 4, name: 'Talent & Culture', score: 58, status: 'Developing' },
        { id: 5, name: 'Governance & Ethics', score: 30, status: 'Emerging' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
                <Link to="/" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maturity Dashboard</h1>
            </div>

            {/* Main Stats Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row items-center justify-around">
                <div className="text-center md:text-left mb-8 md:mb-0">
                    <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Overall Maturity Score</h2>
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">Developing</div>
                    <p className="text-blue-500 text-sm max-w-xs">
                        Your organization is showing steady progress in AI adoption. Focus on foundational technologies to advance.
                    </p>
                </div>

                <div>
                    <DonutChart score={58} label="Overall Score" color="text-blue-600 dark:text-blue-400" size={240} />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Maturity Buckets</h3>
                <div className="flex space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search buckets..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Buckets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buckets.map((bucket) => (
                    <div key={bucket.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 dark:text-white">{bucket.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${bucket.score >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    bucket.score >= 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                {bucket.status}
                            </span>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                                        Score
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                                        {bucket.score}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100 dark:bg-gray-700">
                                <div
                                    style={{ width: `${bucket.score}%` }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${bucket.score >= 70 ? 'bg-green-500' :
                                            bucket.score >= 50 ? 'bg-blue-500' :
                                                'bg-yellow-500'
                                        }`}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
