
'use client';

import type { FullMatch, GameEvent, GameEventType, Player, SelectedPlayer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Hand, RefreshCw, Shield, Square, Timer, Target, Goal, Footprints } from 'lucide-react';


interface ManualEntryFormProps {
  match: FullMatch;
}

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand /> },
  { type: 'SHOT', label: 'Tiro', icon: <Footprints /> },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square className="text-yellow-400 fill-current" />, className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' },
  { type: 'RED_CARD', label: 'Roja', icon: <Square className="text-red-500 fill-current" />, className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { type: 'TIMEOUT', label: 'T. Muerto', icon: <Timer />, className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];


const EventCreationForm = ({ player, onEventCreated }: { player: Player; onEventCreated: () => void }) => {
    const { state, dispatch, handleCreateGameEvent } = useGame();
    const [eventType, setEventType] = useState<GameEventType | null>(null);
    const { toast } = useToast();
    
    const initialMinute = Math.floor(state.time / 60);
    const initialSecond = state.time % 60;

    const [minute, setMinute] = useState(20 - initialMinute - (initialSecond > 0 ? 1 : 0));
    const [second, setSecond] = useState(initialSecond > 0 ? 60 - initialSecond : 0);

    const handleAddEvent = () => {
        if (!eventType) {
            toast({ variant: 'destructive', title: "Faltan datos", description: "Por favor, seleccione un tipo de evento."});
            return;
        }

        const teamId = player.teamId === state.teamA?.id ? state.teamA.id : state.teamB?.id;
        const teamName = player.teamId === state.teamA?.id ? state.teamA.name : state.teamB?.name;
        
        if(!teamId || !teamName) return;

        const timeInSeconds = (20 - minute) * 60 - second;

        const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
            type: eventType,
            teamId,
            playerId: player.id,
            playerName: player.name,
            teamName,
            timestamp: timeInSeconds,
            playerInId: null,
            playerInName: null,
        };

        dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
        handleCreateGameEvent(newEvent);

        toast({
            title: "Evento Registrado",
            description: `${eventType} para ${player.name} en el minuto ${minute}:${String(second).padStart(2, '0')}.`
        });
        
        onEventCreated();
    };
    
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                 <div className="text-center">
                    <h3 className="font-bold">Registrar Evento</h3>
                    <p className="text-sm text-muted-foreground">
                        Para: {player.name}
                    </p>
                </div>
                
                 <div className="grid grid-cols-4 gap-2">
                    {actionButtons.map(action => (
                        <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant={eventType === action.type ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "w-full flex-col h-16",
                                eventType !== action.type && action.className
                            )}
                            onClick={() => setEventType(action.type)}
                        >
                            {React.cloneElement(action.icon as React.ReactElement, { className: 'h-5 w-5 mb-1' })}
                            <span className="text-xs">{action.label}</span>
                        </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`minute-${player.id}`}>Minuto</Label>
                        <Input id={`minute-${player.id}`} type="number" value={minute} onChange={e => setMinute(parseInt(e.target.value))} />
                    </div>
                     <div>
                        <Label htmlFor={`second-${player.id}`}>Segundo</Label>
                        <Input id={`second-${player.id}`} type="number" value={second} onChange={e => setSecond(parseInt(e.target.value))} />
                    </div>
                </div>
                <Button onClick={handleAddEvent} disabled={!eventType} className="w-full">
                    Añadir Evento
                </Button>
            </CardContent>
        </Card>
    )
}


const PlayerButton = ({ player, onSelect, isSelected, isActive, className }: { player: Player, onSelect: () => void, isSelected: boolean, isActive: boolean, className?: string }) => {
    const { state } = useGame();
    const [popoverOpen, setPopoverOpen] = useState(false);
    
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
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
                        isSelected && 'ring-2 ring-offset-2 ring-primary ring-offset-background',
                        isActive && !isSelected && 'bg-primary/10',
                        className
                    )}
                >
                    {player.number}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <EventCreationForm player={player} onEventCreated={() => setPopoverOpen(false)} />
            </PopoverContent>
        </Popover>
    );
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

export function ManualEntryForm({ match }: ManualEntryFormProps) {
    const { state, dispatch } = useGame();
    const { selectedPlayer: selectedPlayerData } = state;

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
            {(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') && (
                <StarterSelectionActions />
            )}
        </div>
    );
}
