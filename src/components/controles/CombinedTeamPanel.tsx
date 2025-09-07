'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { JerseyButton } from './JerseyButton';
import type { SelectedPlayer, GameEvent, Player } from '@/types';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';


const PlayerList = ({ teamId }: { teamId: 'A' | 'B'}) => {
    const { state, dispatch, createGameEvent } = useGame();
    const team = teamId === 'A' ? state.teamA : state.teamB;
    const { selectedPlayer, substitutionState, status } = state;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    if (!team) return null;

    const handlePlayerSelect = (playerId: number) => {
        const payload: SelectedPlayer = { teamId, playerId };

        if (substitutionState) {
            const { playerOut } = substitutionState;
            if (teamId === playerOut.teamId && playerId !== playerOut.playerId) {
                const pOut = team.players.find(p => p.id === playerOut.playerId);
                const pIn = team.players.find(p => p.id === playerId);
                if (pOut && pIn) {
                    dispatch({ type: 'COMPLETE_SUBSTITUTION', payload: { playerInId: pIn.id }});
                    const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
                        type: 'SUBSTITUTION',
                        teamId: team.id,
                        playerId: pOut.id,
                        playerName: pOut.name,
                        playerInId: pIn.id,
                        playerInName: pIn.name,
                        teamName: team.name,
                        timestamp: state.time,
                    };
                    createGameEvent(newEvent);
                }
            }
            return;
        }

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
        if (isPlayerBeingSubbedOut(playerId)) return 'destructive';
        if (isSelected) return teamId === 'A' ? 'accent-blue' : 'accent-red';
        if (isActive) return 'default';
        return 'outline';
    }
    
    const playersWithStatus = team.players.map(p => ({ ...p, isActive: activePlayers.includes(p.id) }));
    const starters = playersWithStatus.filter(p => p.isActive);
    const substitutes = playersWithStatus.filter(p => !p.isActive);
    
    const isSelectionMode = status === 'SELECTING_STARTERS';

    const renderPlayerButtons = (playersToRender: Player[]) => {
        return playersToRender.map((player) => {
            const isSelected = (!!selectedPlayer &&
                                selectedPlayer.teamId === teamId &&
                                selectedPlayer.playerId === player.id) ||
                                (isSelectionMode && activePlayers.includes(player.id));
            
            let isDisabled = false;
            if (substitutionState) {
                const subOutTeam = substitutionState.playerOut.teamId;
                if (teamId === subOutTeam) {
                    if (playersWithStatus.find(p => p.id === player.id)?.isActive) {
                        isDisabled = true;
                    }
                } else {
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
                        isActive={activePlayers.includes(player.id)}
                        isDisabled={isDisabled}
                        variant={variant}
                        onClick={() => handlePlayerSelect(player.id)}
                    />
                </motion.div>
            );
        });
    }

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
                        {renderPlayerButtons(team.players)}
                    </div>
                 ) : (
                    <>
                    <div>
                        <h3 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">Titulares</h3>
                        <div className="flex flex-wrap items-start justify-center gap-4">
                            {starters.length > 0 ? renderPlayerButtons(starters) : <p className="text-xs text-muted-foreground p-4 text-center">No hay titulares.</p>}
                        </div>
                    </div>
                    
                    {substitutionState && substitutionState.playerOut.teamId === teamId && (
                        <div className="mt-4">
                            <Separator className="my-2" />
                            <h3 className="px-2 mb-2 text-sm font-semibold text-blue-500 animate-pulse">Seleccione jugador entrante</h3>
                            <div className="flex flex-wrap items-start justify-center gap-4">
                                {substitutes.length > 0 ? renderPlayerButtons(substitutes) : <p className="text-xs text-muted-foreground p-4 text-center">No hay suplentes disponibles.</p>}
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
    return (
        <Card className="h-full flex flex-col">
            <div className="flex-grow flex flex-col md:flex-row">
                <PlayerList teamId="A" />
                <Separator orientation="vertical" className="h-auto mx-0 hidden md:block" />
                <Separator orientation="horizontal" className="my-0 md:hidden" />
                <PlayerList teamId="B" />
            </div>
        </Card>
    )
}
