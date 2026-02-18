import React from 'react';
import { EffectComposer, Outline, Selection, Select } from '@react-three/postprocessing';
import { useRobotStore } from '../../stores/robotStore';

export const PostProcessingEffects: React.FC = () => {
  return (
    <EffectComposer autoClear={false}>
      <Outline
        blur
        edgeStrength={3}
        pulseSpeed={0}
        visibleEdgeColor={0x3b82f6}
        hiddenEdgeColor={0x1d4ed8}
        xRay={false}
      />
    </EffectComposer>
  );
};

// Re-export Selection and Select for use in parent components
export { Selection, Select };
