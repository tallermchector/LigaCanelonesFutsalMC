
'use client';

import type { FullMatch, Player } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

interface ManualEntryFormProps {
  match: FullMatch;
}

const PlayerButton = ({ player, onSelect, isSelected }: { player: Player, onSelect: () => void, isSelected: boolean }) => (
    <Button
        variant="outline"
        className={cn(
            "aspect-square h-16 w-16 text-lg font-bold transition-all duration-200 ease-in-out",
            isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90'
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

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-center">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-2">
                {sortedPlayers.slice(0, 12).map(player => (
                    <PlayerButton
                        key={player.id}
                        player={player}
                        onSelect={() => onPlayerSelect(player.id)}
                        isSelected={selectedPlayerId === player.id}
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
            <div className="grid grid-cols-2 gap-4">
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
