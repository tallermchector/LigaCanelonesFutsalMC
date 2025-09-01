'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveMatchCardProps {
  match: FullMatch;
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link href={`/banner/${match.id}`} className="block group">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-4 bg-card-foreground/5 flex-row items-center justify-between">
              <h3 className="font-bold text-sm truncate">{match.teamA.name} vs {match.teamB.name}</h3>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Badge variant="destructive" className="animate-pulse">
                    <Tv className="mr-1.5 h-3 w-3" />
                    EN VIVO
                </Badge>
              </motion.span>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-around">
            <div className="flex flex-col items-center gap-2 text-center w-20">
              <Image
                src={match.teamA.logoUrl || `https://avatar.vercel.sh/${match.teamA.name}.png`}
                alt={`Logo de ${match.teamA.name}`}
                width={48}
                height={48}
                className="rounded-full aspect-square object-contain"
              />
              <span className="font-semibold text-xs truncate w-full">{match.teamA.name}</span>
            </div>
            <div className="text-3xl font-bold text-primary tabular-nums">
              {match.scoreA} - {match.scoreB}
            </div>
            <div className="flex flex-col items-center gap-2 text-center w-20">
              <Image
                src={match.teamB.logoUrl || `https://avatar.vercel.sh/${match.teamB.name}.png`}
                alt={`Logo de ${match.teamB.name}`}
                width={48}
                height={48}
                className="rounded-full aspect-square object-contain"
              />
              <span className="font-semibold text-xs truncate w-full">{match.teamB.name}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
