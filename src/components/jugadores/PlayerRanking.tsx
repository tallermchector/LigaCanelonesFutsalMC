
'use client';

import type { Player, Team } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlayerWithStats extends Player {
    goals: number;
    team: Team;
}

interface RankingProps {
  players: PlayerWithStats[];
}

const FeaturedPlayer = ({ player }: { player: PlayerWithStats }) => {
    const teamSlug = player.team.name.toLowerCase().replace(/\s+/g, '-');
    return (
    <div className="relative mb-8 overflow-hidden rounded-xl bg-muted/50 p-8 pt-16 text-center transition-shadow hover:shadow-lg group">
        <div
        className="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundImage: `url(${player.team.logoUrl || ''})` }}
        />
        <div className="absolute top-4 left-4 text-lg font-bold text-primary">1º</div>
        <Link href={`/jugadores/${player.id}`} className="block">
            <Image
            src={'/placeholder-player.png'}
            alt={`Foto de ${player.name}`}
            width={160}
            height={160}
            className="mx-auto mb-4 h-40 w-40 rounded-full object-cover object-top shadow-lg transition-transform group-hover:scale-105"
            />
            <h2 className="text-3xl font-black uppercase text-foreground group-hover:text-primary transition-colors">{player.name}</h2>
        </Link>
        <Link href={`/clubes/${teamSlug}`} className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
            <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={16} height={16} />
            <span className="font-semibold">{player.team.name}</span>
        </Link>
        <div className="absolute bottom-8 right-8 text-right">
        <div className="text-7xl font-black text-primary">{player.goals}</div>
        <div className="text-lg font-bold uppercase text-muted-foreground">Goles</div>
        </div>
    </div>
  )
};

export function PlayerRanking({ players }: RankingProps) {
  if (players.length === 0) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No hay datos de ranking disponibles.</CardContent></Card>;
  }

  const featuredPlayer = players[0];
  const rankedList = players.slice(1);

  return (
    <div>
        <div className="mb-6 flex justify-center gap-2">
            <Button>Goles</Button>
            <Button variant="outline">Asistencias</Button>
            <Button variant="outline">Partidos Jugados</Button>
        </div>

        <FeaturedPlayer player={featuredPlayer} />

        <Card className="overflow-hidden">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-16 text-center">POS.</TableHead>
                <TableHead>JUGADOR</TableHead>
                <TableHead className="w-24 text-right">GOLES</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rankedList.map((player, index) => {
                    const teamSlug = player.team.name.toLowerCase().replace(/\s+/g, '-');
                    return (
                        <TableRow key={player.id} className="hover:bg-muted/30">
                            <TableCell className="text-center font-bold text-muted-foreground">{index + 2}º</TableCell>
                            <TableCell>
                            <Link href={`/jugadores/${player.id}`} className="flex items-center gap-4 group">
                                <Image
                                src={'/placeholder-player.png'}
                                alt={`Foto de ${player.name}`}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover object-top transition-transform group-hover:scale-105"
                                />
                                <div>
                                <div className="font-bold group-hover:text-primary transition-colors">{player.name}</div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Link href={`/clubes/${teamSlug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                        <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={14} height={14} />
                                        {player.team.name}
                                    </Link>
                                </div>
                                </div>
                            </Link>
                            </TableCell>
                            <TableCell className="text-right text-2xl font-black text-primary">{player.goals}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        </Card>
    </div>
  );
}
