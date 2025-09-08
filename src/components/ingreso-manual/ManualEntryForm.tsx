
'use client';

import type { FullMatch, GameEvent, GameEventType, Player, SelectedPlayer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ActionMenuManual } from './ActionMenuManual';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ManualEntryFormProps {
  match: FullMatch;
}

const PlayerButton = ({ player, onSelect, isSelected, isActive, className }: { player: Player, onSelect: () => void, isSelected: boolean, isActive: boolean, className?: string }) => {
    const { state } = useGame();
    
    if(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') {
        return (
             <Button
                variant="outline"
                className={cn(
                    "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
                    isSelected && 'ring-2 ring-offset-2 ring-primary ring-offset-background',
                    className
                )}
                onClick={onSelect}
            >
                {player.number}
            </Button>
        )
    }

    return (
         <Button
            variant="outline"
            className={cn(
                "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
                isSelected && 'ring-2 ring-offset-2 ring-primary ring-offset-background',
                isActive && !isSelected && 'bg-primary/10',
                className
            )}
            onClick={onSelect}
        >
            {player.number}
        </Button>
    )
};

const TeamPlayerGrid = ({ teamId, team, onPlayerSelect, selectedPlayerId }: { teamId: 'A' | 'B', team: FullMatch['teamA'], onPlayerSelect: (teamId: 'A' | 'B', playerId: number) => void, selectedPlayerId: number | null }) => {
    const { state } = useGame();
    const { status } = state;
    const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;

    const positionOrder: Player['position'][] = ["GOLERO", "DEFENSA", "ALA", "PIVOT"];

    const sortedPlayers = [...team.players].sort((a, b) => {
        const posA = positionOrder.indexOf(a.position);
        const posB = positionOrder.indexOf(b.position);
        
        if (posA === -1) return 1;
        if (posB === -1) return -1;

        if (posA !== posB) {
            return posA - posB;
        }
        return a.number - b.number;
    });

    const isSelectionMode = status === 'SCHEDULED' || status === 'SELECTING_STARTERS';
    
    const starters = isSelectionMode ? [] : sortedPlayers.filter(p => activePlayers.includes(p.id));
    const substitutes = isSelectionMode ? sortedPlayers.slice(0,12) : sortedPlayers.filter(p => !activePlayers.includes(p.id));

    return (
        <Card className="flex-1 overflow-hidden">
            <CardContent className="grid grid-cols-1 grid-rows-1 gap-0 p-0 h-full">
                {isSelectionMode ? (
                    <div className="grid grid-cols-3 grid-rows-4 gap-0 p-0 h-full">
                        {substitutes.map((player, index) => (
                            <PlayerButton
                                key={player.id}
                                player={player}
                                onSelect={() => onPlayerSelect(teamId, player.id)}
                                isSelected={activePlayers.includes(player.id)}
                                isActive={activePlayers.includes(player.id)}
                                className={cn(
                                index === 2 && "rounded-tr-lg",
                                index === 9 && "rounded-bl-lg",
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="grid grid-cols-3 grid-rows-2 gap-0 p-0">
                           {starters.map((player) => (
                                <PlayerButton
                                    key={player.id}
                                    player={player}
                                    onSelect={() => onPlayerSelect(teamId, player.id)}
                                    isSelected={selectedPlayerId === player.id}
                                    isActive={true}
                                />
                            ))}
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 grid-rows-2 gap-0 p-0 flex-grow">
                             {substitutes.slice(0,6).map((player) => (
                                <PlayerButton
                                    key={player.id}
                                    player={player}
                                    onSelect={() => onPlayerSelect(teamId, player.id)}
                                    isSelected={selectedPlayerId === player.id}
                                    isActive={false}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const StarterSelectionActions = () => {
    const { state, dispatch } = useGame();
    const { toast } = useToast();

    const handleConfirmStarters = () => {
        if (state.activePlayersA.length > 5 || state.activePlayersB.length > 5) {
            toast({ variant: 'destructive', title: "Error", description: "No puede haber más de 5 jugadores por equipo."});
            return;
        }
         if (state.activePlayersA.length < 5 || state.activePlayersB.length < 5) {
            toast({ variant: 'destructive', title: "Error", description: "Debe seleccionar 5 jugadores por equipo."});
            return;
        }
        dispatch({ type: 'SET_STATUS', payload: 'LIVE' });
        toast({ title: "Titulares Confirmados", description: "El partido está listo para comenzar."});
    };

    return (
        <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Selecciona 5 jugadores por equipo para definir los titulares.</p>
            <Button onClick={handleConfirmStarters}>Confirmar Titulares e Iniciar</Button>
        </div>
    )
}

const EventCreationForm = ({ selectedPlayer }: { selectedPlayer: Player | null }) => {
    const { state, dispatch, handleCreateGameEvent } = useGame();
    const [eventType, setEventType] = useState<GameEventType | null>(null);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const { toast } = useToast();

    React.useEffect(() => {
        const gameTime = state.time;
        const totalMinutes = Math.floor(gameTime / 60);
        const remainingSeconds = gameTime % 60;
        setMinute(20 - totalMinutes - (remainingSeconds > 0 ? 1 : 0));
        setSecond(remainingSeconds > 0 ? 60 - remainingSeconds : 0);
    }, [state.time, selectedPlayer]);

    const handleAddEvent = () => {
        if (!selectedPlayer || !eventType) {
            toast({ variant: 'destructive', title: "Faltan datos", description: "Por favor, seleccione un jugador y un tipo de evento."});
            return;
        }

        const teamId = selectedPlayer.teamId === state.teamA?.id ? state.teamA.id : state.teamB?.id;
        const teamName = selectedPlayer.teamId === state.teamA?.id ? state.teamA.name : state.teamB?.name;
        
        if(!teamId || !teamName) return;

        const timeInSeconds = (20 - minute) * 60 - second;

        const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
            type: eventType,
            teamId,
            playerId: selectedPlayer.id,
            playerName: selectedPlayer.name,
            teamName,
            timestamp: timeInSeconds,
            playerInId: null,
            playerInName: null,
        };

        dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
        handleCreateGameEvent(newEvent);

        toast({
            title: "Evento Registrado",
            description: `${eventType} para ${selectedPlayer.name} en el minuto ${minute}:${second}.`
        });
        
        // Reset
        setEventType(null);
        dispatch({ type: 'SELECT_PLAYER', payload: null });
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                 <div className="text-center">
                    <h3 className="font-bold">Registrar Nuevo Evento</h3>
                    <p className="text-sm text-muted-foreground">
                        {selectedPlayer ? `Para: ${selectedPlayer.name}` : 'Seleccione un jugador'}
                    </p>
                </div>
                 <ActionMenuManual
                    onAction={(type) => setEventType(type)}
                    selectedEventType={eventType}
                 />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="minute">Minuto</Label>
                        <Input id="minute" type="number" value={minute} onChange={e => setMinute(parseInt(e.target.value))} />
                    </div>
                     <div>
                        <Label htmlFor="second">Segundo</Label>
                        <Input id="second" type="number" value={second} onChange={e => setSecond(parseInt(e.target.value))} />
                    </div>
                </div>
                <Button onClick={handleAddEvent} disabled={!selectedPlayer || !eventType} className="w-full">
                    Añadir Evento
                </Button>
            </CardContent>
        </Card>
    )
}


export function ManualEntryForm({ match }: ManualEntryFormProps) {
    const { state, dispatch } = useGame();
    const { selectedPlayer: selectedPlayerData } = state;

    const selectedPlayer = selectedPlayerData 
      ? state.teamA?.players.find(p => p.id === selectedPlayerData.playerId) || state.teamB?.players.find(p => p.id === selectedPlayerData.playerId) || null 
      : null;

    const handlePlayerSelect = (teamId: 'A' | 'B', playerId: number) => {
        if (state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') {
             dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload: { teamId, playerId } });
        } else {
            if (selectedPlayerData?.playerId === playerId) {
                dispatch({ type: 'SELECT_PLAYER', payload: null });
            } else {
                dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId } });
            }
        }
    }
    
    return (
        <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-2">
                <TeamPlayerGrid teamId="A" team={match.teamA} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayerData?.playerId || null} />
                <TeamPlayerGrid teamId="B" team={match.teamB} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayerData?.playerId || null} />
            </div>
            {(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') ? (
                <StarterSelectionActions />
            ) : (
                <EventCreationForm selectedPlayer={selectedPlayer}/>
            )}
        </div>
    );
}
