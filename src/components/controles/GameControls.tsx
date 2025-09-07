'use client';

import { ControlsPanel } from './ControlsPanel';
import { useGame } from '@/contexts/GameProvider';
import { CombinedTeamPanel } from './CombinedTeamPanel';

export function GameControls() {
  const { state } = useGame();
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="lg:w-2/3">
        <CombinedTeamPanel />
      </div>
      <div className="lg:w-1/3 flex flex-col gap-4">
        <ControlsPanel />
      </div>
    </div>
  );
}
