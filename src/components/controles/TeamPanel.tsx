

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { SelectedPlayer } from '@/types';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


interface TeamPanelProps {
  teamId: 'A' | 'B';
}

export function TeamPanel({ teamId }: TeamPanelProps) {
  const { state, dispatch } = useGame();
  const pathname = usePathname();
  
  const team = teamId === 'A' ? state.teamA : state.teamB;
  const { selectedPlayer, substitutionState, status } = state;
  const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

  if (!team || !team.players) return null;

  const isCanchaPage = pathname.includes('/cancha/');

  const handlePlayerSelect = (playerId: number) => {
    const payload: SelectedPlayer = { teamId, playerId };

    // If we are in substitution mode, selecting a player here completes the sub.
    if (substitutionState) {
        // We can only select players from the same team as the one being subbed out.
        if (teamId === substitutionState.playerOut.teamId) {
            // And the player must not be the same one being subbed out.
            if (playerId !== substitutionState.playerOut.playerId) {
                 dispatch({ type: 'SELECT_PLAYER', payload });
            }
        }
        return; // Do nothing if trying to select from the wrong team.
    }

    // Standard player selection logic for other modes.
    if (status === 'SELECTING_STARTERS') {
      dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload });
    } else {
      dispatch({ type: 'SELECT_PLAYER', payload });
    }
  };
  
  const isPlayerBeingSubbedOut = (playerId: number) => {
      return substitutionState?.playerOut.teamId === teamId && substitutionState?.playerOut.playerId === playerId;
  }
  
  const getPlayerVariant = (playerId: number, isSelected: boolean) => {
      const isActive = activePlayers.includes(playerId);

      if (isCanchaPage) {
          if (isPlayerBeingSubbedOut(playerId)) return 'destructive';
          if (isSelected) return teamId === 'A' ? 'cancha-blue-selected' : 'cancha-red-selected';
          if (isActive) return 'cancha-active';
          return 'cancha-inactive';
      }
      
      const accentColorClass = teamId === 'A' ? 'accent-blue' : 'accent-red';

      if (isPlayerBeingSubbedOut(playerId)) return 'destructive';
      if (isSelected) return teamId === 'A' ? 'accent-blue' : 'accent-red';
      if (isActive) return 'default';
      
      return 'outline';
  }
  
  const playersWithStatus = team.players.map(p => ({ ...p, isActive: activePlayers.includes(p.id) }));
  const starters = playersWithStatus.filter(p => p.isActive);
  const substitutes = playersWithStatus.filter(p => !p.isActive);
  
  const isSelectionMode = status === 'SELECTING_STARTERS';

  const renderPlayerButtons = (playersToRender: typeof playersWithStatus) => {
      return playersToRender.map((player) => {
          const isSelected = (!!selectedPlayer &&
                                selectedPlayer.teamId === teamId &&
                                selectedPlayer.playerId === player.id) ||
                                (isSelectionMode && activePlayers.includes(player.id));
          
          let isDisabled = false;
          // When in substitution mode...
          if (substitutionState) {
              const subOutTeam = substitutionState.playerOut.teamId;
              
              if (teamId === subOutTeam) {
                  // On the team making the sub, only non-active players can be selected to come IN.
                  if (player.isActive) {
                      isDisabled = true;
                  }
              } else {
                  // On the other team, all players are disabled.
                  isDisabled = true;
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
      });
  }


  return (
    <Card className={cn("h-full flex flex-col", isCanchaPage && "bg-gray-800/90 border-gray-700 text-white")}>
      <CardHeader className="flex-shrink-0">
        <CardTitle className={cn("text-center text-primary", isCanchaPage && (teamId === 'A' ? "text-blue-400" : "text-red-400"))}>{team.name}</CardTitle>
        <div className="text-center text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
            <Shirt className="h-4 w-4" />
            <span>Activos: {activePlayers.length} / 5</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-2 overflow-y-auto">
          { isSelectionMode ? (
              <div className="flex flex-wrap items-start justify-center gap-4">
                 {renderPlayerButtons(playersWithStatus)}
              </div>
          ) : (
            <>
              {/* Starters */}
              {!isCanchaPage && (
                <div>
                    <h3 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">Titulares</h3>
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {starters.length > 0 ? renderPlayerButtons(starters) : <p className="text-xs text-muted-foreground p-4 text-center">No hay titulares definidos.</p>}
                    </div>
                </div>
              )}
              
              {/* Substitutes */}
              {!substitutionState && (
                <div className={!isCanchaPage ? "mt-4" : ""}>
                    {!isCanchaPage && <Separator className="my-2" />}
                    <h3 className={cn("px-2 mb-2 text-sm font-semibold", isCanchaPage ? "text-gray-400" : "text-muted-foreground")}>Suplentes</h3>
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {substitutes.length > 0 ? renderPlayerButtons(substitutes) : <p className="text-xs text-muted-foreground p-4 text-center">No hay suplentes disponibles.</p>}
                    </div>
                </div>
              )}

               {/* Substitutes during substitution */}
               {substitutionState && substitutionState.playerOut.teamId === teamId && (
                 <div className="mt-4">
                     <Separator className="my-2" />
                    <h3 className="px-2 mb-2 text-sm font-semibold text-blue-500 animate-pulse">Seleccione jugador entrante</h3>
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {substitutes.length > 0 ? renderPlayerButtons(substitutes) : <p className="text-xs text-muted-foreground p-4 text-center">No hay suplentes para el cambio.</p>}
                    </div>
                 </div>
               )}
            </>
          )}

      </CardContent>
    </Card>
  );
}
