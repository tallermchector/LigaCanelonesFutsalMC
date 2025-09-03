'use client';

import type { Team } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  // Asumimos que el slug se puede generar a partir del nombre, o vendrá de la BD en el futuro.
  const slug = team.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="h-full"
    >
      <Link href={`/clubes/${slug}`} className="block h-full group">
        <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-primary/20">
          <CardContent className="flex-grow flex items-center justify-center p-6 bg-muted/50">
            <Image
              src={team.logoUrl || '/logofu.svg'}
              alt={`Logo de ${team.name}`}
              width={128}
              height={128}
              className="aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </CardContent>
          <CardFooter className="p-3 bg-card-foreground/5 justify-center">
            <p className="text-center font-bold text-card-foreground truncate">{team.name}</p>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
