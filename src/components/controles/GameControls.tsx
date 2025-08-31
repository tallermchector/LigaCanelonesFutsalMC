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
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
      <TeamPanel teamId="A" />
      <div className="flex justify-center items-start py-4 md:py-0">
        <ControlsPanel />
      </div>
      <TeamPanel teamId="B" />
    </div>
  );
}
