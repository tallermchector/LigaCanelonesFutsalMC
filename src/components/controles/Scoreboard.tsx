
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Shield, Timer, Flag } from 'lucide-react';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function Scoreboard() {
  const { state } = useGame();
  const { teamA, teamB, scoreA, scoreB, time, period, foulsA, foulsB, timeoutsA, timeoutsB } = state;

  if (!teamA || !teamB) {
    return null; // Or a loading skeleton
  }

  return (
    <Card className="w-full shadow-lg mb-8 bg-card/80 backdrop-blur-sm border-primary/20">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 items-center text-center">
          {/* Team A Info */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={teamA.logoUrl || ''}
              alt={`Logo de ${teamA.name}`}
              width={64}
              height={64}
              className="rounded-full aspect-square object-contain"
            />
            <h2 className="text-lg font-bold text-card-foreground truncate">{teamA.name}</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> Faltas: {foulsA}</div>
                <div className="flex items-center gap-1"><Timer className="h-4 w-4" /> T.M.: {timeoutsA}</div>
            </div>
          </div>

          {/* Center Score and Time */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl font-black tracking-tighter text-primary">
              {scoreA} - {scoreB}
            </div>
            <div className="font-mono text-4xl font-bold bg-accent text-accent-foreground px-4 py-1 rounded-md">
              {formatTime(time)}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Período: {period}</span>
            </div>
          </div>

          {/* Team B Info */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={teamB.logoUrl || ''}
              alt={`Logo de ${teamB.name}`}
              width={64}
              height={64}
              className="rounded-full aspect-square object-contain"
            />
            <h2 className="text-lg font-bold text-card-foreground truncate">{teamB.name}</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> Faltas: {foulsB}</div>
                <div className="flex items-center gap-1"><Timer className="h-4 w-4" /> T.M.: {timeoutsB}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
