
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { MatchStats } from '@/types';

interface ScoreSummaryProps {
  match: MatchStats;
}

export function ScoreSummary({ match }: ScoreSummaryProps) {
  const { teamA, teamB, scoreA, scoreB, stats } = match;

  const totalFoulsA = stats.foulsByPlayer.filter(p => teamA.players.some(player => player.id === p.player.id)).reduce((sum, p) => sum + p.count, 0);
  const totalFoulsB = stats.foulsByPlayer.filter(p => teamB.players.some(player => player.id === p.player.id)).reduce((sum, p) => sum + p.count, 0);


  return (
    <Card className="w-full shadow-lg bg-black/30 backdrop-blur-sm border-white/10 text-white">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 text-center">
          {/* Team A */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-2 md:gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-right">{teamA.name}</h2>
            <Image
              src={teamA.logoUrl || ''}
              alt={`Logo de ${teamA.name}`}
              width={64}
              height={64}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full aspect-square object-contain"
            />
          </div>

          {/* Score */}
          <div className="flex flex-col">
            <div className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {scoreA} - {scoreB}
            </div>
            <div className="text-sm md:text-lg font-semibold text-white/80 tracking-normal mt-1">FINAL</div>
          </div>

          {/* Team B */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-start gap-2 md:gap-4">
             <Image
              src={teamB.logoUrl || ''}
              alt={`Logo de ${teamB.name}`}
              width={64}
              height={64}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full aspect-square object-contain"
            />
            <h2 className="text-lg md:text-2xl font-bold text-left">{teamB.name}</h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-center border-t border-white/10 pt-4">
            <div>
                <p className="font-semibold text-white/90">Faltas {teamA.name}</p>
                <p className="text-white/70">{totalFoulsA}</p>
            </div>
             <div>
                <p className="font-semibold text-white/90">Faltas {teamB.name}</p>
                <p className="text-white/70">{totalFoulsB}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
