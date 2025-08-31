
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
    <Card className="w-full shadow-lg bg-card/80 backdrop-blur-sm border-primary/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          {/* Team A */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-4">
            <h2 className="text-2xl font-bold text-card-foreground text-right truncate max-w-xs">{teamA.name}</h2>
            <Image
              src={teamA.logoUrl || `https://avatar.vercel.sh/${teamA.name}.png`}
              alt={`Logo de ${teamA.name}`}
              width={80}
              height={80}
              className="rounded-full aspect-square object-contain"
            />
          </div>

          {/* Score */}
          <div className="text-6xl font-black tracking-tighter text-primary">
            {scoreA} - {scoreB}
            <div className="text-lg font-semibold text-muted-foreground tracking-normal">FINAL</div>
          </div>

          {/* Team B */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-start gap-4">
            <Image
              src={teamB.logoUrl || `https://avatar.vercel.sh/${teamB.name}.png`}
              alt={`Logo de ${teamB.name}`}
              width={80}
              height={80}
              className="rounded-full aspect-square object-contain"
            />
            <h2 className="text-2xl font-bold text-card-foreground text-left truncate max-w-xs">{teamB.name}</h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-center border-t pt-4">
            <div>
                <p className="font-semibold">Faltas {teamA.name}</p>
                <p className="text-muted-foreground">{totalFoulsA}</p>
            </div>
             <div>
                <p className="font-semibold">Faltas {teamB.name}</p>
                <p className="text-muted-foreground">{totalFoulsB}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
