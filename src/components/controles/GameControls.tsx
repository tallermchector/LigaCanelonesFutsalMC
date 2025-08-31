
'use client';

import { TeamPanel } from './TeamPanel';
import { ControlsPanel } from './ControlsPanel';
import { useGame } from '@/contexts/GameProvider';

export function GameControls() {
  const { state } = useGame();
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full h-full">
      <TeamPanel teamId="A" />
      <div className="flex flex-col justify-center items-center py-4 md:py-0">
        <ControlsPanel />
      </div>
      <TeamPanel teamId="B" />
    </div>
  );
}
