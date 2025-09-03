
'use client';

import { TeamPanel } from './TeamPanel';
import { ControlsPanel } from './ControlsPanel';
import { useGame } from '@/contexts/GameProvider';
import { EventButtons } from './EventButtons';

export function GameControls() {
  const { state } = useGame();
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <TeamPanel teamId="A" />
      <div className="flex flex-col gap-4">
        <ControlsPanel />
        <EventButtons />
      </div>
      <TeamPanel teamId="B" />
    </div>
  );
}
