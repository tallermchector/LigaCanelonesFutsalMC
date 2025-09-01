
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { MatchStats } from '@/types';

interface ScoreSummaryProps {
  match: MatchStats;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getPeriodLabel = (period: number): string => {
    if (period === 2) return 'PERÍODO 2';
    return 'PERÍODO 1';
};

export function ScoreSummary({ match }: ScoreSummaryProps) {
  const { teamA, teamB, scoreA, scoreB, status, period, time } = match;

  const renderStatus = () => {
    if (status === 'LIVE') {
        return (
            <div className="flex flex-col items-center">
                <div className="font-mono text-xl md:text-2xl font-bold text-white">
                    {formatTime(time)}
                </div>
                <div className="text-xs md:text-sm font-semibold text-white/80 tracking-widest mt-1">
                    {getPeriodLabel(period)}
                </div>
            </div>
        );
    }
    return <div className="text-sm md:text-lg font-semibold text-white/80 tracking-widest mt-1">FINAL</div>
  }

  return (
    <Card className="w-full shadow-lg bg-black/30 backdrop-blur-sm border-white/10 text-white overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 text-center">
          {/* Team A */}
          <div className="flex flex-col md:flex-row items-center justify-end gap-2 md:gap-4">
            <h2 className="text-base md:text-2xl font-bold text-right truncate">{teamA.name}</h2>
            <Image
              src={teamA.logoUrl || ''}
              alt={`Logo de ${teamA.name}`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full aspect-square object-contain"
            />
          </div>

          {/* Score */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {scoreA} - {scoreB}
            </div>
            <div className="h-12 flex items-center justify-center">
                {renderStatus()}
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-start gap-2 md:gap-4">
             <Image
              src={teamB.logoUrl || ''}
              alt={`Logo de ${teamB.name}`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full aspect-square object-contain"
            />
            <h2 className="text-base md:text-2xl font-bold text-left truncate">{teamB.name}</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
