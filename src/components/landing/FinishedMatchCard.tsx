
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FinishedMatchCardProps {
  match: FullMatch;
}

export function FinishedMatchCard({ match }: FinishedMatchCardProps) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
      if (match.scheduledTime) {
        setFormattedDate(new Date(match.scheduledTime).toLocaleDateString('es-UY', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }));
      }
    }, [match.scheduledTime]);


  return (
    <Link href={`/partidos/${match.id}/estadisticas`} className="block group">
      <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 bg-card">
        <CardHeader className="p-4">
            <CardTitle className="text-base font-bold truncate text-center text-card-foreground">
                {match.teamA.name} vs {match.teamB.name}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-around p-4">
          <div className="flex flex-col items-center gap-2 text-center w-24">
            <Image
              src={match.teamA.logoUrl || `https://avatar.vercel.sh/${match.teamA.name}.png`}
              alt={`Logo de ${match.teamA.name}`}
              width={56}
              height={56}
              className="rounded-full aspect-square object-contain"
            />
          </div>
          <div className="text-4xl font-bold text-primary tabular-nums">
            {match.scoreA} - {match.scoreB}
          </div>
           <div className="flex flex-col items-center gap-2 text-center w-24">
            <Image
              src={match.teamB.logoUrl || `https://avatar.vercel.sh/${match.teamB.name}.png`}
              alt={`Logo de ${match.teamB.name}`}
              width={56}
              height={56}
              className="rounded-full aspect-square object-contain"
            />
          </div>
        </CardContent>
        <CardFooter className="p-3 bg-accent text-accent-foreground justify-center text-sm font-medium group-hover:bg-accent/90 transition-colors">
            <div className='flex items-center gap-2'>
                <BarChart2 className="h-4 w-4" />
                Ver Estadísticas
            </div>
            {formattedDate && (
                <>
                    <span className="mx-2">|</span>
                    <div className='flex items-center gap-2'>
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                    </div>
                </>
            )}
        </CardFooter>
      </Card>
    </Link>
  );
}
