
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { SelectedPlayer } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-primary">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-2 overflow-y-auto">
        <div className="flex flex-wrap items-start justify-center gap-4">
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
          </div>
      </CardContent>
    </Card>
  );
}
