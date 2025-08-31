
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { SelectedPlayer } from '@/types';

interface TeamPanelProps {
  teamId: 'A' | 'B';
}

export function TeamPanel({ teamId }: TeamPanelProps) {
  const { state, dispatch } = useGame();
  
  const team = teamId === 'A' ? state.teamA : state.teamB;
  const { selectedPlayer } = state;

  if (!team || !team.players) return null;

  const handlePlayerSelect = (playerId: number) => {
    const payload: SelectedPlayer = { teamId, playerId };
    dispatch({ type: 'SELECT_PLAYER', payload });
  };

  return (
    <Card className="flex-1 shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-center text-primary">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-start justify-center gap-4 pt-6 overflow-y-auto">
        {team.players.map((player) => (
          <JerseyButton
            key={player.id}
            jerseyNumber={player.number}
            playerName={player.name}
            isSelected={
              !!selectedPlayer &&
              selectedPlayer.teamId === teamId &&
              selectedPlayer.playerId === player.id
            }
            onClick={() => handlePlayerSelect(player.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
