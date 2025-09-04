import type { Player } from '@/types';
import { CardContent } from '../ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface TeamPlayersProps {
    players: Player[];
}

const positionTranslations: { [key: string]: string } = {
    GOLERO: 'Porteros',
    DEFENSA: 'Defensas',
    ALA: 'Alas',
    PIVOT: 'Pivots',
};

// Definir el orden de las posiciones
const orderedPositions = ['GOLERO', 'DEFENSA', 'ALA', 'PIVOT'];

export function TeamPlayers({ players }: TeamPlayersProps) {
    const groupedPlayers = players.reduce((acc, player) => {
        const position = player.position || 'Unknown';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(player);
        return acc;
    }, {} as Record<string, Player[]>);

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
                                {groupedPlayers[position].map(player => {
                                    const avatarNumber = (player.id % 3) + 1;
                                    const avatarUrl = `/avatar/${avatarNumber}.png`;
                                    return (
                                        <Link key={player.id} href={`/jugadores/${player.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/30 group">
                                            <div className="w-8 text-center font-bold text-primary text-lg">
                                                {player.number}
                                            </div>
                                            <Image
                                                src={avatarUrl}
                                                alt={`Foto de ${player.name}`}
                                                width={40}
                                                height={40}
                                                className="rounded-full aspect-square object-cover"
                                            />
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {player.name}
                                            </div>
                                            <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </CardContent>
    );
}
