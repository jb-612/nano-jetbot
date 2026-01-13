import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Layers, ChevronLeft } from 'lucide-react';
import { ORGANIZATION_DATA, type Division } from '../../types';

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['amdocs']));
    const [selectedId, setSelectedId] = useState('amdocs');

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const renderItem = (item: Division, depth = 0) => {
        const isExpanded = expandedIds.has(item.id);
        const isSelected = selectedId === item.id;
        const hasChildren = item.children && item.children.length > 0;

        if (collapsed) return null;

        return (
            <div key={item.id}>
                <div
                    className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-r-4 border-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
                    onClick={() => setSelectedId(item.id)}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => toggleExpand(item.id, e)}
                            className="mr-2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    )}
                    {!hasChildren && <span className="w-6" />}

                    {item.type === 'COMPANY' ? (
                        <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                    ) : (
                        <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                    )}

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
                        {item.name}
                    </span>

                    <span className={`text-[10px] px-1.5 py-0.5 rounded ml-2 uppercase ${item.type === 'COMPANY'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}>
                        {item.type}
                    </span>
                </div>

                {isExpanded && item.children && (
                    <div>
                        {item.children.map(child => renderItem(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`relative bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${collapsed ? 'w-12' : 'w-80'
            }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center h-16">
                {!collapsed && <h2 className="font-bold text-gray-800 dark:text-white">Organization</h2>}
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                {!collapsed && renderItem(ORGANIZATION_DATA)}
            </div>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md hover:bg-gray-50 text-gray-500"
            >
                <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
};
