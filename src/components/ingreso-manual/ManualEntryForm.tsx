
'use client';

import type { FullMatch, Player, SelectedPlayer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
        {isActive && <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500" />}
    </div>
);

const TeamPlayerGrid = ({ teamId, team, onPlayerSelect, selectedPlayerId }: { teamId: 'A' | 'B', team: FullMatch['teamA'], onPlayerSelect: (teamId: 'A' | 'B', playerId: number) => void, selectedPlayerId: number | null }) => {
    const { state } = useGame();
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
    
    const playersToDisplay = sortedPlayers.slice(0, 12);

    return (
        <Card className="flex-1 overflow-hidden">
            <CardContent className="grid grid-cols-3 grid-rows-4 gap-0 p-0 h-full">
                {playersToDisplay.map((player, index) => (
                    <PlayerButton
                        key={player.id}
                        player={player}
                        onSelect={() => onPlayerSelect(teamId, player.id)}
                        isSelected={selectedPlayerId === player.id}
                        isActive={activePlayers.includes(player.id)}
                        className={cn(
                           index === 2 && "rounded-tr-lg",
                           index === 9 && "rounded-bl-lg",
                        )}
                    />
                ))}
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
            } else if (activePlayers.includes(playerId)) {
                dispatch({ type: 'SELECT_PLAYER', payload: { teamId, playerId } });
            }
        }
    }
    
    return (
        <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-2 h-96">
                <TeamPlayerGrid teamId="A" team={match.teamA} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayer?.playerId || null} />
                <TeamPlayerGrid teamId="B" team={match.teamB} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayer?.playerId || null} />
            </div>
            {(state.status === 'SCHEDULED' || state.status === 'SELECTING_STARTERS') && <StarterSelectionActions />}
        </div>
    );
}
