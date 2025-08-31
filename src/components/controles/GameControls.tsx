'use client';

import { TeamPanel } from './TeamPanel';
import { ControlsPanel } from './ControlsPanel';

export function GameControls() {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <TeamPanel teamId="A" />
      <div className="flex justify-center">
        <ControlsPanel />
      </div>
      <TeamPanel teamId="B" />
    </div>
  );
}
