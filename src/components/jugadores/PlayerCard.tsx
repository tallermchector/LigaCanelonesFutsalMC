
'use client';

import type { Player, Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/jugadores/${player.id}`} className="block h-full group">
        <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20 bg-background">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
            <Image
              src={'/placeholder-player.png'} // Usamos un placeholder ya que imageUrl no está en el tipo
              alt={`Foto de ${player.name}`}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute top-0 right-0 p-4 text-right">
                 <span className="text-5xl font-black text-white drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}>
                    {player.number}
                </span>
            </div>
             <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold leading-tight">{player.name}</h3>
                <p className="text-sm text-white/80 font-medium">{player.position}</p>
            </div>
          </div>
          <CardContent className="p-4 bg-muted/50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Image
                    src={player.team.logoUrl || ''}
                    alt={`Logo de ${player.team.name}`}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                />
                <span className="text-sm font-semibold text-foreground">{player.team.name}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
