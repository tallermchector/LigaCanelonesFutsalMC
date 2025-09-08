
'use client';

import type { FullMatch, Player } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface ManualEntryFormProps {
  match: FullMatch;
}

const PlayerButton = ({ player, onSelect, isSelected, className }: { player: Player, onSelect: () => void, isSelected: boolean, className?: string }) => (
    <Button
        variant="outline"
        className={cn(
            "aspect-square h-full w-full text-lg font-bold transition-all duration-200 ease-in-out rounded-none text-foreground/80 border-border/30 hover:bg-muted/50",
            isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
            className
        )}
        onClick={onSelect}
    >
        {player.number}
    </Button>
);

const TeamPlayerGrid = ({ team, onPlayerSelect, selectedPlayerId }: { team: FullMatch['teamA'], onPlayerSelect: (playerId: number) => void, selectedPlayerId: number | null }) => {
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
                        onSelect={() => onPlayerSelect(player.id)}
                        isSelected={selectedPlayerId === player.id}
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


export function ManualEntryForm({ match }: ManualEntryFormProps) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

    const handlePlayerSelect = (playerId: number) => {
        setSelectedPlayerId(current => (current === playerId ? null : playerId));
    }
    
    return (
        <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 h-96">
                <TeamPlayerGrid team={match.teamA} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayerId} />
                <TeamPlayerGrid team={match.teamB} onPlayerSelect={handlePlayerSelect} selectedPlayerId={selectedPlayerId} />
            </div>
            <div className="flex justify-end">
                <Button size="lg" variant="accent" disabled={!selectedPlayerId}>
                    <Save className="mr-2 h-5 w-5" />
                    Asignar Evento
                </Button>
            </div>
        </div>
    );
}
