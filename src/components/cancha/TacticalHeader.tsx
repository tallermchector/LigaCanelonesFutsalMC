
'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, MatchStatus } from '@/types';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getPeriodLabel(status: MatchStatus, period: number) {
    if (status === 'FINISHED') return 'FIN';
    if (status === 'SCHEDULED') return 'PRO';
    return `${period}T`;
}

export function TacticalHeader({ match }: { match: FullMatch }) {
  const { state } = useGame();
  const { teamA, teamB, scoreA, scoreB, time, period, status, isRunning } = state;

  if (!teamA || !teamB) {
    return null; // or a skeleton
  }

  return (
    <header className="flex items-center justify-between p-2 md:p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 flex-shrink-0">
      {/* Team A */}
      <div className="flex items-center gap-2 md:gap-4 w-1/3 justify-start">
        <Image src={teamA.logoUrl || ''} alt={teamA.name} width={48} height={48} className="h-8 w-8 md:h-12 md:w-12"/>
        <span className="hidden sm:block text-sm md:text-lg font-bold truncate">{teamA.name}</span>
         <span className="block sm:hidden text-lg font-bold">{teamA.name.substring(0, 3)}</span>
      </div>

      {/* Score and Time */}
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-1">
        <span className="text-2xl md:text-4xl font-bold">{scoreA}</span>
        <div className="flex flex-col items-center justify-center text-lg md:text-xl font-mono bg-black/30 px-2 py-1 rounded-lg leading-tight">
          <div className='flex items-center gap-1'>
            {!isRunning && <Play className="h-4 w-4 text-green-500" />}
            <span>{formatTime(time)}</span>
          </div>
          <span className="text-xs font-semibold">{getPeriodLabel(status, period)}</span>
        </div>
        <span className="text-2xl md:text-4xl font-bold">{scoreB}</span>
      </div>

      {/* Team B */}
      <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
        <span className="hidden sm:block text-sm md:text-lg font-bold truncate">{teamB.name}</span>
        <span className="block sm:hidden text-lg font-bold">{teamB.name.substring(0, 3)}</span>
        <Image src={teamB.logoUrl || ''} alt={teamB.name} width={48} height={48} className="h-8 w-8 md:h-12 md:w-12"/>
      </div>
    </header>
  );
}
