
import type { MatchStats } from '@/types';
import Image from 'next/image';

interface MatchSummaryHeaderProps {
  match: MatchStats;
}

export function MatchSummaryHeader({ match }: MatchSummaryHeaderProps) {
    const { teamA, teamB, scoreA, scoreB } = match;

    return (
        <div className="relative text-white bg-black/30 rounded-lg backdrop-blur-sm p-4">
            <div className="flex flex-col md:flex-row justify-around items-center text-center gap-4">
                {/* Team A */}
                <div className="flex items-center gap-4 w-full md:w-1/3 justify-center">
                    <Image
                        src={teamA.logoUrl || ''}
                        alt={`Logo de ${teamA.name}`}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <h2 className="text-lg md:text-xl font-bold uppercase flex-1 text-left">{teamA.name}</h2>
                </div>

                {/* Score */}
                <div className="text-5xl md:text-6xl font-black tracking-tighter text-center w-full md:w-auto order-first md:order-none">
                    <span>{scoreA}</span>
                    <span className="mx-2">-</span>
                    <span>{scoreB}</span>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-4 w-full md:w-1/3 justify-center flex-row-reverse md:flex-row">
                    <Image
                        src={teamB.logoUrl || ''}
                        alt={`Logo de ${teamB.name}`}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <h2 className="text-lg md:text-xl font-bold uppercase flex-1 text-right md:text-left">{teamB.name}</h2>
                </div>
            </div>
        </div>
    );
}
