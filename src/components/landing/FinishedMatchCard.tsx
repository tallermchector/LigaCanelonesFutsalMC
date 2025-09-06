
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BarChart2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface FinishedMatchCardProps {
  match: FullMatch;
}

const TeamRow = ({ team, score }: { team: FullMatch['teamA'], score: number }) => (
    <div className="flex items-center gap-2">
        <Image
            src={team.logoUrl || ''}
            alt={`Logo de ${team.name}`}
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
        />
        <span className="font-semibold text-base text-foreground truncate">{team.name}</span>
    </div>
);


export function FinishedMatchCard({ match }: FinishedMatchCardProps) {
  const isActionable = match.status === 'LIVE' || match.status === 'FINISHED';
  const scheduledDate = new Date(match.scheduledTime);
  const formattedDate = scheduledDate.toLocaleDateString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
      <Card className="flex flex-col h-full overflow-hidden shadow-md bg-card transition-all duration-300 hover:shadow-primary/10">
        <CardHeader className="p-3 text-xs text-muted-foreground flex flex-row justify-between items-center bg-muted/50">
            <span>Jornada {match.round}</span>
            <span>{formattedDate}</span>
        </CardHeader>
        <CardContent className="flex-grow p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex flex-col gap-2 items-start text-left">
                <TeamRow team={match.teamA} score={match.scoreA} />
                <TeamRow team={match.teamB} score={match.scoreB} />
            </div>
             <div className="text-3xl font-bold text-primary tabular-nums flex flex-col items-center justify-center h-full px-2">
                <span>{match.scoreA}</span>
                <Separator orientation='horizontal' className='my-1 w-4 bg-border' />
                <span>{match.scoreB}</span>
            </div>
             <div className="flex flex-col gap-2 items-end text-right">
               {/* Puedes agregar más info si es necesario, o dejarlo vacío para alinear */}
            </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/50">
            <div className="flex items-center gap-2 w-full">
                <Button asChild size="sm" variant="ghost" className="text-muted-foreground flex-1" disabled={!isActionable}>
                  <Link href={`/resumen/${match.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Resumen
                  </Link>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                 <Button asChild size="sm" variant="ghost" className="text-muted-foreground flex-1" disabled={!isActionable}>
                  <Link href={`/partidos/${match.id}/estadisticas`}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Estadísticas
                  </Link>
                </Button>
            </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
