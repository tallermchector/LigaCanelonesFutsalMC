'use client';

import { ControlsPanel } from './ControlsPanel';
import { useGame } from '@/contexts/GameProvider';
import { CombinedTeamPanel } from './CombinedTeamPanel';
import { EventButtons } from './EventButtons';

export function GameControls() {
  const { state } = useGame();
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <div className="lg:col-span-2">
        <CombinedTeamPanel />
      </div>
      <div className="flex flex-col gap-4">
        {/* Panel de Controles siempre visible */}
        <ControlsPanel />
        
        {/* Panel de Eventos solo para móvil, se oculta en pantallas grandes */}
        <div className="lg:hidden">
            <EventButtons />
        </div>
      </div>
    </div>
  );
}
