
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
                <div className="flex items-center gap-4 w-full md:w-2/5 justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src={teamA.logoUrl || ''}
                            alt={`Logo de ${teamA.name}`}
                            width={64}
                            height={64}
                            className="w-12 h-12 md:w-16 md:h-16 object-contain"
                        />
                        <h2 className="text-lg md:text-xl font-bold uppercase text-left">{teamA.name}</h2>
                    </div>
                    <span className="text-4xl md:text-5xl font-black tracking-tighter">{scoreA}</span>
                </div>

                {/* Separator */}
                <div className="text-2xl font-bold text-muted-foreground w-full md:w-auto">
                    <span className="hidden md:inline-block">-</span>
                    <span className="md:hidden">VS</span>
                </div>

                {/* Team B */}
                <div className="flex items-center gap-4 w-full md:w-2/5 justify-between flex-row-reverse">
                    <div className="flex items-center gap-4 flex-row-reverse">
                        <Image
                            src={teamB.logoUrl || ''}
                            alt={`Logo de ${teamB.name}`}
                            width={64}
                            height={64}
                            className="w-12 h-12 md:w-16 md:h-16 object-contain"
                        />
                        <h2 className="text-lg md:text-xl font-bold uppercase text-right">{teamB.name}</h2>
                    </div>
                    <span className="text-4xl md:text-5xl font-black tracking-tighter">{scoreB}</span>
                </div>
            </div>
        </div>
    );
}
