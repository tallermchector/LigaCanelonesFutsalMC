
import { Calendar, Users } from 'lucide-react';
import type { MatchStats } from '@/types';

interface SummaryHeaderProps {
  match: MatchStats;
}

export function SummaryHeader({ match }: SummaryHeaderProps) {
  const matchDate = new Date(match.scheduledTime).toLocaleDateString('es-UY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
        Resumen del Partido
      </h1>
      <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
        {match.teamA.name} vs. {match.teamB.name}
      </p>
      <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Liga Senior de Futsal</span>
        </div>
      </div>
    </div>
  );
}
