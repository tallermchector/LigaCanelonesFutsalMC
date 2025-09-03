'use client';

import type { Player, Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Asumimos que el tipo Player ahora puede incluir la información del equipo
interface PlayerWithTeam extends Player {
    team: Team;
}

interface PlayerCardProps {
  player: PlayerWithTeam;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/jugadores/${player.id}`} className="block h-full group">
        <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20">
          <CardHeader className="p-0 relative aspect-square">
            <Image
              src={'/placeholder-player.png'} // Usamos un placeholder ya que imageUrl no está en el tipo
              alt={`Foto de ${player.name}`}
              fill
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
             <div className="absolute bottom-2 left-4 text-white">
                <CardTitle className="text-lg font-bold">{player.name}</CardTitle>
                <CardDescription className="text-white/80">{player.position}</CardDescription>
            </div>
             <Image
                src={player.team.logoUrl || ''}
                alt={`Logo de ${player.team.name}`}
                width={40}
                height={40}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
             />
          </CardHeader>
          <CardContent className="p-4 bg-muted/50 text-sm text-muted-foreground">
             <p>Equipo: <span className="font-semibold text-foreground">{player.team.name}</span></p>
             <p>Número: <span className="font-semibold text-foreground">{player.number}</span></p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
