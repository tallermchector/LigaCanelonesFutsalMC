
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface FinishedMatchCardProps {
  match: FullMatch;
}

export function FinishedMatchCard({ match }: FinishedMatchCardProps) {
  const isActionable = match.status === 'LIVE' || match.status === 'FINISHED';

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Card className="flex flex-col h-full overflow-hidden shadow-lg bg-card">
        <CardHeader className="p-4">
            <CardTitle className="text-base font-bold truncate text-center text-card-foreground">
                {match.teamA.name} vs {match.teamB.name}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-around p-4 gap-2">
          <div className="flex flex-col items-center gap-2 text-center flex-1 min-w-0">
            <Image
              src={match.teamA.logoUrl || ''}
              alt={`Logo de ${match.teamA.name}`}
              width={56}
              height={56}
              className="rounded-full aspect-square object-contain"
            />
            <span className="text-sm font-semibold truncate w-full">{match.teamA.name}</span>
          </div>
          {match.status !== 'SCHEDULED' ? (
              <div className="text-4xl font-bold text-primary tabular-nums px-2">
                  {match.scoreA} - {match.scoreB}
              </div>
          ) : (
             <div className="text-sm text-muted-foreground font-semibold">
                {new Date(match.scheduledTime).toLocaleDateString('es-UY', {
                    day: 'numeric', month: 'short'
                })}
                <br />
                {new Date(match.scheduledTime).toLocaleTimeString('es-UY', {
                    hour: '2-digit', minute: '2-digit'
                })}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 text-center flex-1 min-w-0">
            <Image
              src={match.teamB.logoUrl || ''}
              alt={`Logo de ${match.teamB.name}`}
              width={56}
              height={56}
              className="rounded-full aspect-square object-contain"
            />
            <span className="text-sm font-semibold truncate w-full">{match.teamB.name}</span>
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/50 grid grid-cols-2 gap-2">
            <Button asChild size="sm" variant="outline" disabled={!isActionable}>
              <Link href={`/resumen/${match.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                Resumen
              </Link>
            </Button>
             <Button asChild size="sm" variant="outline" disabled={!isActionable}>
              <Link href={`/partidos/${match.id}/estadisticas`}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Estadísticas
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
