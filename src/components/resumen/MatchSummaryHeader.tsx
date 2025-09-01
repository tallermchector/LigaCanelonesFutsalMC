
import type { MatchStats } from '@/types';
import Image from 'next/image';

interface MatchSummaryHeaderProps {
  match: MatchStats;
}

export function MatchSummaryHeader({ match }: MatchSummaryHeaderProps) {
    const { teamA, teamB, scoreA, scoreB } = match;

    return (
        <div className="relative text-white">
            <div className="flex justify-center items-center h-28 md:h-36 bg-black/30 rounded-lg backdrop-blur-sm px-4">
                <div className="flex-1 flex items-center justify-start gap-2 md:gap-4">
                     <Image
                        src={teamA.logoUrl || ''}
                        alt={`Logo de ${teamA.name}`}
                        width={80}
                        height={80}
                        className="w-12 h-12 md:w-20 md:h-20 object-contain"
                    />
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold uppercase truncate">{teamA.name}</h2>
                </div>

                <div className="text-4xl md:text-6xl font-black tracking-tighter text-center bg-white/10 px-3 py-1 sm:px-4 sm:py-2 rounded-md">
                    <span>{scoreA}</span>
                    <span className="mx-1 sm:mx-2">-</span>
                    <span>{scoreB}</span>
                </div>

                <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                     <h2 className="text-base sm:text-xl md:text-2xl font-bold uppercase truncate text-right">{teamB.name}</h2>
                     <Image
                        src={teamB.logoUrl || ''}
                        alt={`Logo de ${teamB.name}`}
                        width={80}
                        height={80}
                        className="w-12 h-12 md:w-20 md:h-20 object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
