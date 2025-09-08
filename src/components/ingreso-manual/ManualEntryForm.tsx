
'use client';

import type { FullMatch, Player, SelectedPlayer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface ManualEntryFormProps {
  match: FullMatch;
}

const PlayerButton = ({ player, onSelect, isSelected, isActive, className }: { player: Player, onSelect: () => void, isSelected: boolean, isActive: boolean, className?: string }) => (
    <div className="relative">
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
        {isActive && <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />}
    </div>
);

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
                           {starters.map((player, index) => (
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
                             {substitutes.slice(0,6).map((player, index) => (
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
    const { selectedPlayer } = state;

    const handlePlayerSelect = (teamId: 'A' | 'B', playerId: number) => {
        const activePlayers = teamId === 'A' ? state.activePlayersA : state.activePlayersB;
        if (state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') {
             dispatch({ type: 'TOGGLE_ACTIVE_PLAYER', payload: { teamId, playerId } });
        } else {
            if (selectedPlayer?.playerId === playerId) {
                dispatch({ type: 'SELECT_PLAYER', payload: null });
            } else {
                dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId } });
            }
        }
    }
    
    return (
        <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <TeamPlayerGrid teamId="A" team={match.teamA} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayer?.playerId || null} />
                <TeamPlayerGrid teamId="B" team={match.teamB} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayer?.playerId || null} />
            </div>
            {(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') && <StarterSelectionActions />}
        </div>
    );
}
