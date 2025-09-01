
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { SelectedPlayer } from '@/types';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';

interface TeamPanelProps {
  teamId: 'A' | 'B';
}

export function TeamPanel({ teamId }: TeamPanelProps) {
  const { state, dispatch } = useGame();
  
  const team = teamId === 'A' ? state.teamA : state.teamB;
  const { selectedPlayer, substitutionState, status } = state;
  const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

  if (!team || !team.players) return null;

  const handlePlayerSelect = (playerId: number) => {
    const payload: SelectedPlayer = { teamId, playerId };
    if (status === 'SCHEDULED') {
      dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload });
    } else {
      dispatch({ type: 'SELECT_PLAYER', payload });
    }
  };
  
  const isPlayerBeingSubbedOut = (playerId: number) => {
      return substitutionState?.playerOut.teamId === teamId && substitutionState?.playerOut.playerId === playerId;
  }
  
  const isSubstitutionModeForThisTeam = () => {
      return substitutionState?.playerOut.teamId === teamId;
  }
  
  const canRegisterEventForPlayer = (playerId: number, eventType: 'card' | 'action') => {
      if (eventType === 'card') return true;
      return activePlayers.includes(playerId);
  }

  const getPlayerVariant = (playerId: number, isSelected: boolean) => {
      const isActive = activePlayers.includes(playerId);
      
      if (isPlayerBeingSubbedOut(playerId)) return 'destructive';
      if (isSelected) return 'accent';
      if (isActive) return 'default'; // A new variant or style to show they are active
      
      return 'outline';
  }
  
  const playersWithStatus = team.players.map(p => ({ ...p, isActive: activePlayers.includes(p.id) }));
  const sortedPlayers = [...playersWithStatus].sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-primary">{team.name}</CardTitle>
        <div className="text-center text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
            <Shirt className="h-4 w-4" />
            <span>Activos: {activePlayers.length} / 5</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-2 overflow-y-auto">
        <div className="flex flex-wrap items-start justify-center gap-4">
            {sortedPlayers.map((player) => {
              const isSelected = !!selectedPlayer &&
                                 selectedPlayer.teamId === teamId &&
                                 selectedPlayer.playerId === player.id;
              
              let isDisabled = false;
              if (status !== 'SCHEDULED') {
                  if (substitutionState) {
                      const subOutTeam = substitutionState.playerOut.teamId;
                      const subOutPlayerId = substitutionState.playerOut.playerId;
                      if (teamId === subOutTeam) {
                          // Team making the sub: disable player coming out, disable subs
                          if (player.id === subOutPlayerId) isDisabled = true;
                          if (!activePlayers.includes(player.id)) isDisabled = true;
                      } else {
                          // Other team: disable everyone
                          isDisabled = true;
                      }
                  } else {
                      // Not in substitution mode
                      const isCardEventSelected = false; // This needs a way to be known
                      if (!isCardEventSelected && !activePlayers.includes(player.id)) {
                          isDisabled = true;
                      }
                  }
              }
              
              const variant = getPlayerVariant(player.id, isSelected);

              return (
              <motion.div key={player.id} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                <JerseyButton
                  jerseyNumber={player.number}
                  playerName={player.name}
                  isSelected={isSelected || isPlayerBeingSubbedOut(player.id)}
                  isActive={player.isActive}
                  isDisabled={isDisabled}
                  variant={variant}
                  onClick={() => handlePlayerSelect(player.id)}
                />
              </motion.div>
              );
            })}
          </div>
      </CardContent>
    </Card>
  );
}
