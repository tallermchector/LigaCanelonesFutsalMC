'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { Player, SelectedPlayer } from '@/types';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ActionMenu } from './ActionMenu';
import { Shirt } from 'lucide-react';

const PlayerList = ({ teamId }: { teamId: 'A' | 'B' }) => {
    const { state, dispatch } = useGame();
    const team = teamId === 'A' ? state.teamA : state.teamB;
    const { selectedPlayer, substitutionState, status } = state;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    if (!team) return null;

    const handlePlayerSelect = (player: Player) => {
        const payload: SelectedPlayer = { teamId, playerId: player.id };
        dispatch({ type: 'SELECT_PLAYER', payload });
    };
    
    const isPlayerBeingSubbedOut = (playerId: number) => {
        return substitutionState?.playerOut?.teamId === teamId && substitutionState?.playerOut?.playerId === playerId;
    }
    
    const getPlayerVariant = (playerId: number): 'default' | 'outline' | 'destructive' => {
        const isActive = activePlayers.includes(playerId);
        if (isPlayerBeingSubbedOut(playerId)) return 'destructive';
        if (isActive) return 'default';
        return 'outline';
    }
    
    const playersWithStatus = team.players.map(p => ({ ...p, isActive: activePlayers.includes(p.id) }));
    const starters = playersWithStatus.filter(p => p.isActive);
    const substitutes = playersWithStatus.filter(p => !p.isActive);
    
    const isSelectionMode = status === 'SELECTING_STARTERS';

    return (
        <div className="flex-1">
            <CardHeader className="p-4">
                 <CardTitle className={cn("text-center", teamId === 'A' ? 'text-primary' : 'text-accent' )}>{team.name}</CardTitle>
                 <div className="text-center text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
                    <Shirt className="h-4 w-4" />
                    <span>Activos: {activePlayers.length} / 5</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-2 overflow-y-auto">
                 { isSelectionMode ? (
                    <div className="flex flex-wrap items-start justify-center gap-4">
                        {team.players.map(player => (
                           <JerseyButton
                                key={player.id}
                                jerseyNumber={player.number}
                                playerName={player.name}
                                isSelected={activePlayers.includes(player.id)}
                                isActive={activePlayers.includes(player.id)}
                                onClick={() => dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload: { teamId, playerId: player.id } })}
                                variant={getPlayerVariant(player.id)}
                            />
                        ))}
                    </div>
                 ) : (
                    <>
                    <div>
                        <h3 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">Titulares</h3>
                        <div className="flex flex-wrap items-start justify-center gap-4">
                            {starters.length > 0 ? starters.map(p => (
                                <JerseyButton
                                    key={p.id}
                                    jerseyNumber={p.number}
                                    playerName={p.name}
                                    isSelected={selectedPlayer?.playerId === p.id}
                                    isActive={true}
                                    onClick={() => handlePlayerSelect(p)}
                                />
                            )) : <p className="text-xs text-muted-foreground p-4 text-center">No hay titulares.</p>}
                        </div>
                    </div>
                    
                    {substitutionState && substitutionState.playerOut.teamId === teamId && (
                        <div className="mt-4">
                            <Separator className="my-2" />
                            <h3 className="px-2 mb-2 text-sm font-semibold text-blue-500 animate-pulse">Seleccione jugador entrante</h3>
                            <div className="flex flex-wrap items-start justify-center gap-4">
                                {substitutes.length > 0 ? substitutes.map(p => (
                                     <JerseyButton
                                        key={p.id}
                                        jerseyNumber={p.number}
                                        playerName={p.name}
                                        isSelected={false}
                                        isActive={false}
                                        onClick={() => dispatch({ type: 'COMPLETE_SUBSTITUTION', payload: { playerInId: p.id }})}
                                        variant="outline"
                                    />
                                )) : <p className="text-xs text-muted-foreground p-4 text-center">No hay suplentes disponibles.</p>}
                            </div>
                        </div>
                    )}
                    </>
                 )}
            </CardContent>
        </div>
    )
}


export function CombinedTeamPanel() {
  const { state, dispatch } = useGame();
  const { selectedPlayer } = state;

  const handleSheetClose = () => {
    dispatch({ type: 'SELECT_PLAYER', payload: null });
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex-grow flex flex-col md:flex-row">
        <PlayerList teamId="A" />
        <Separator orientation="vertical" className="h-auto mx-0 hidden md:block" />
        <Separator orientation="horizontal" className="my-0 md:hidden" />
        <PlayerList teamId="B" />
      </div>
      <Sheet open={!!selectedPlayer && !state.substitutionState} onOpenChange={(isOpen) => !isOpen && handleSheetClose()}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Registrar Acción</SheetTitle>
                <SheetDescription>
                    Seleccione una acción para el jugador seleccionado.
                </SheetDescription>
            </SheetHeader>
            <ActionMenu onActionComplete={handleSheetClose} />
        </SheetContent>
      </Sheet>
    </Card>
  );
}
