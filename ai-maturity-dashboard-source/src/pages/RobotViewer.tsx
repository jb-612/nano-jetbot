import React from 'react';
import { RobotViewer } from '../components/Robot3D/RobotViewer';
import { SceneSetup } from '../components/Robot3D/SceneSetup';
import { JetBotModel } from '../components/Robot3D/JetBotModel';
import { PartInfoPanel } from '../components/RobotUI/PartInfoPanel';
import { PartToolbar } from '../components/RobotUI/PartToolbar';

export const RobotViewerPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* 3D Canvas - left 70% */}
        <div className="flex-[7] relative bg-gray-50 dark:bg-gray-950">
          <RobotViewer>
            <SceneSetup />
            <JetBotModel />
          </RobotViewer>

          {/* Overlay instructions */}
          <div className="absolute bottom-3 left-3 text-xs text-gray-400 dark:text-gray-600 pointer-events-none select-none">
            <span>Click to select</span>
            <span className="mx-1.5">|</span>
            <span>Double-click to detach/attach</span>
            <span className="mx-1.5">|</span>
            <span>Scroll to zoom</span>
          </div>
        </div>

        {/* Part detail panel - right 30% */}
        <div className="flex-[3] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
          <PartInfoPanel />
        </div>
      </div>

      {/* Bottom toolbar with part chips */}
      <PartToolbar />
    </div>
  );
};
