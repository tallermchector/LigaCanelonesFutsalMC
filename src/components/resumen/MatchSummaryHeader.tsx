
import type { MatchStats } from '@/types';
import Image from 'next/image';

interface MatchSummaryHeaderProps {
  match: MatchStats;
}

const formatTime = (seconds: number) => {
    const flooredSeconds = Math.floor(seconds);
    const minutes = Math.floor(flooredSeconds / 60);
    const remainingSeconds = flooredSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getPeriodLabel = (period: number): string => {
    if (period === 2) return 'PERÍODO 2';
    return 'PERÍODO 1';
};

export function MatchSummaryHeader({ match }: MatchSummaryHeaderProps) {
    const { teamA, teamB, scoreA, scoreB, status, period, time, scheduledTime } = match;

    const renderMatchStatus = () => {
        switch (status) {
            case 'LIVE':
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
            case 'FINISHED':
                return (
                     <div className="text-sm md:text-lg font-semibold text-white/80 tracking-widest">FINAL</div>
                );
            case 'SCHEDULED':
                 return (
                    <div className="text-sm md:text-base font-semibold text-white/80 tracking-wider">
                        {new Date(scheduledTime).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}
                        {' - '}
                        {new Date(scheduledTime).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}hs
                    </div>
                );
            default:
                return null;
        }
    }


    return (
        <div className="relative text-white bg-black/30 rounded-lg backdrop-blur-sm p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                {/* Team A */}
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src={teamA.logoUrl || ''}
                        alt={`Logo de ${teamA.name}`}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <h2 className="text-sm md:text-xl font-bold uppercase text-center w-full truncate">{teamA.name}</h2>
                </div>

                {/* Score / Status */}
                <div className="flex flex-col items-center justify-center px-1">
                    <div className="text-3xl md:text-5xl font-black tracking-tighter text-white flex items-center gap-2 md:gap-4">
                       <span>{scoreA}</span>
                       <span className="text-xl md:text-2xl text-white/80 font-medium">-</span>
                       <span>{scoreB}</span>
                    </div>
                    <div className="mt-1 h-8 flex items-center justify-center">
                        {renderMatchStatus()}
                    </div>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src={teamB.logoUrl || ''}
                        alt={`Logo de ${teamB.name}`}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <h2 className="text-sm md:text-xl font-bold uppercase text-center w-full truncate">{teamB.name}</h2>
                </div>
            </div>
        </div>
    );
}
