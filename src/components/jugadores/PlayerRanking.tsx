
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
    const avatarNumber = (player.id % 3) + 1;
    const avatarUrl = `/avatar/${avatarNumber}.png`;
    
    return (
    <div className="relative mb-8 overflow-hidden rounded-xl p-4 sm:p-8 sm:pt-12 text-center transition-shadow hover:shadow-lg group text-white">
        <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url('/banner_youtube.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        <div className="relative z-10">
            <div className="absolute top-0 left-0 text-lg font-bold text-primary-foreground drop-shadow-md">1º</div>
            <Link href={`/jugadores/${player.id}`} className="block">
                <Image
                src={avatarUrl}
                alt={`Foto de ${player.name}`}
                width={160}
                height={160}
                className="mx-auto mb-4 h-32 w-32 sm:h-40 sm:w-40 rounded-full object-contain object-bottom drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
                />
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white drop-shadow-lg group-hover:text-primary transition-colors">{player.name}</h2>
            </Link>
            <Link href={`/clubes/${teamSlug}`} className="flex items-center justify-center gap-2 text-white/80 hover:text-primary">
                <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={16} height={16} />
                <span className="font-semibold text-sm sm:text-base">{player.team.name}</span>
            </Link>
            <div className="mt-4 sm:absolute sm:bottom-0 sm:right-4 sm:mt-0 sm:text-right">
                <div className="text-6xl sm:text-7xl font-black text-primary drop-shadow-lg">{player.goals}</div>
                <div className="text-base sm:text-lg font-bold uppercase text-white/80">Goles</div>
            </div>
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
                    const avatarNumber = (player.id % 3) + 1;
                    const avatarUrl = `/avatar/${avatarNumber}.png`;
                    return (
                        <TableRow key={player.id} className="hover:bg-muted/30">
                            <TableCell className="text-center font-bold text-muted-foreground">{index + 2}º</TableCell>
                            <TableCell>
                            <div className="flex items-center gap-4 group">
                                <Link href={`/jugadores/${player.id}`}>
                                    <Image
                                    src={avatarUrl}
                                    alt={`Foto de ${player.name}`}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover object-top transition-transform group-hover:scale-105"
                                    />
                                </Link>
                                <div>
                                <Link href={`/jugadores/${player.id}`} className="font-bold group-hover:text-primary transition-colors">{player.name}</Link>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Link href={`/clubes/${teamSlug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                        <Image src={player.team.logoUrl || ''} alt={`Logo de ${player.team.name}`} width={14} height={14} />
                                        {player.team.name}
                                    </Link>
                                </div>
                                </div>
                            </div>
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
