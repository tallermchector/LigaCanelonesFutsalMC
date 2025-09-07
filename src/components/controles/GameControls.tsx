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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="md:col-span-2">
        <CombinedTeamPanel />
      </div>
      <div className="md:col-span-1 flex flex-col gap-4">
        <ControlsPanel />
      </div>
    </div>
  );
}
