
import type { MatchStats } from '@/types';
import Image from 'next/image';

interface MatchSummaryHeaderProps {
  match: MatchStats;
}

export function MatchSummaryHeader({ match }: MatchSummaryHeaderProps) {
    const { teamA, teamB, scoreA, scoreB } = match;

    return (
        <div className="relative mb-8 text-white">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-2 bg-black/30 rounded-t-lg backdrop-blur-sm">
                {/* Team A */}
                <div className="flex items-center justify-end gap-4">
                    <h2 className="text-xl md:text-2xl font-bold uppercase text-right">{teamA.name}</h2>
                </div>

                {/* Score */}
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-center bg-white/10 px-4 py-1 rounded-md">
                    <span>{scoreA}</span>
                    <span className="mx-2">-</span>
                    <span>{scoreB}</span>
                </div>

                {/* Team B */}
                <div className="flex items-center justify-start gap-4">
                    <h2 className="text-xl md:text-2xl font-bold uppercase text-left">{teamB.name}</h2>
                </div>
            </div>
             <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2">
                <Image
                    src={teamA.logoUrl || `https://avatar.vercel.sh/${teamA.name}.png`}
                    alt={`Logo de ${teamA.name}`}
                    width={100}
                    height={100}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                />
            </div>
            <div className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2">
                <Image
                    src={teamB.logoUrl || `https://avatar.vercel.sh/${teamB.name}.png`}
                    alt={`Logo de ${teamB.name}`}
                    width={100}
                    height={100}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                />
            </div>
        </div>
    );
}
