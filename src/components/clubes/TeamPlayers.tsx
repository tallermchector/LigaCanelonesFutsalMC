import type { Player } from '@/types';
import { PlayerCard } from '@/components/jugadores/PlayerCard';
import { CardContent } from '../ui/card';

interface TeamPlayersProps {
    players: Player[];
}

export function TeamPlayers({ players }: TeamPlayersProps) {
    return (
        <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {players.map(player => (
                    <PlayerCard key={player.id} player={{...player, team: {id: 0, name: '', logoUrl: '', players: []}}} />
                ))}
            </div>
        </CardContent>
    );
}