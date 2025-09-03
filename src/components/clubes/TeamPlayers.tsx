import type { Player } from '@/types';
import { CardContent } from '../ui/card';
import Image from 'next/image';

interface TeamPlayersProps {
    players: Player[];
}

const positionTranslations: { [key: string]: string } = {
    Goalkeeper: 'Porteros',
    Defender: 'Defensas',
    Winger: 'Alas',
    Pivot: 'Pivots',
};

export function TeamPlayers({ players }: TeamPlayersProps) {
    const groupedPlayers = players.reduce((acc, player) => {
        const position = player.position || 'Unknown';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(player);
        return acc;
    }, {} as Record<string, Player[]>);

    const orderedPositions = ['Goalkeeper', 'Defender', 'Winger', 'Pivot'];

    return (
        <CardContent className="p-0">
            <div className="space-y-4">
                {orderedPositions.map(position => (
                    groupedPlayers[position] && (
                        <div key={position}>
                            <h3 className="bg-muted/50 px-4 py-2 text-sm font-semibold text-muted-foreground">
                                {positionTranslations[position] || position}
                            </h3>
                            <div className="divide-y divide-border">
                                {groupedPlayers[position].map(player => (
                                    <div key={player.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                                        <div className="w-8 text-center font-bold text-primary text-lg">
                                            {player.number}
                                        </div>
                                        <Image
                                            src={'/placeholder-player.png'}
                                            alt={`Foto de ${player.name}`}
                                            width={40}
                                            height={40}
                                            className="rounded-full aspect-square object-cover"
                                        />
                                        <div className="font-medium text-foreground">
                                            {player.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </CardContent>
    );
}
