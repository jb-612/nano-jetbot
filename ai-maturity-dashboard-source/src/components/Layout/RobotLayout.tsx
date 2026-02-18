import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Wifi, Gamepad2, FileCode2 } from 'lucide-react';

const ROBOT_TABS = [
  { path: '/robot/viewer', label: '3D Viewer', icon: Box },
  { path: '/robot/connectivity', label: 'Connectivity', icon: Wifi },
  { path: '/robot/control', label: 'Control', icon: Gamepad2 },
  { path: '/robot/api', label: 'API Docs', icon: FileCode2 },
] as const;

interface RobotLayoutProps {
  children: React.ReactNode;
}

export const RobotLayout: React.FC<RobotLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        {ROBOT_TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
};
