
'use client';

import Image from 'next/image';
import { Timer, ShieldOff } from 'lucide-react';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, MatchStatus } from '@/types';
import { cn } from '@/lib/utils';
import { FutsalBallIcon } from '@/components/icons';


// --- Funciones de Ayuda ---
function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function getPeriodLabel(status: MatchStatus, period: number) {
    if (status === 'FINISHED') return 'FINALIZADO';
    if (status === 'SCHEDULED') return 'PROGRAMADO';
    if (period === 2) return 'SEGUNDO TIEMPO';
    return 'PRIMER TIEMPO';
}

// --- Subcomponente para Estadísticas ---
const StatDisplay = ({ label, value, icon, hasPenalty }: { label: string, value: number, icon: React.ReactNode, hasPenalty?: boolean }) => (
    <div className="flex flex-col items-center gap-1 text-center text-white">
        <div className="flex items-center gap-1">
            <div className={cn('h-4 w-4', hasPenalty ? 'text-red-400' : 'text-white/70')}>{icon}</div>
            <span className={cn('text-2xl md:text-3xl font-bold', hasPenalty ? 'text-red-400' : 'text-white')}>
                {value}
            </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{label}</span>
    </div>
);

// --- Componente Principal ---
export function TacticalHeader({ match }: { match: FullMatch }) {
    const { state } = useGame();
    // Usamos los datos del estado del juego, pero si no existen, usamos los del 'match' inicial.
    const { teamA, teamB, scoreA, scoreB, time, period, status, timeoutsA, timeoutsB, foulsA, foulsB } = state.teamA ? state : match;

    if (!teamA || !teamB) {
        return null; // O mostrar un esqueleto de carga
    }
    
    const leagueLogo = '/logofu.png';

    return (
        <div className="font-sans w-full flex flex-col items-center py-4">
            {/* Logo de la Liga */}
            <div className="relative z-20 mb-[-28px] bg-[#1a212e] p-1 rounded-full border-4 border-[#1a212e] shadow-lg">
                <Image src={leagueLogo} alt="League Logo" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-contain"/>
            </div>

            {/* Marcador Principal */}
            <div className="w-full text-white shadow-2xl rounded-none overflow-hidden flex items-stretch justify-between bg-[#1a212e]">
                
                {/* Equipo A (Local) */}
                <div className="flex flex-col justify-between gap-2 p-2 flex-1 min-w-0 bg-[#2c3e50]">
                    <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-wider uppercase leading-tight text-center truncate">{teamA.name}</h2>
                    <div className="flex items-center justify-around">
                        <Image src={teamA.logoUrl || ''} alt={`${teamA.name} logo`} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0" />
                        <div className="text-5xl md:text-7xl font-orbitron font-black">{scoreA}</div>
                    </div>
                     <div className="flex items-center justify-around pt-1 border-t border-white/10">
                        <StatDisplay label="Faltas" value={foulsA} icon={<ShieldOff />} hasPenalty={foulsA >= 6} />
                        <StatDisplay label="T.M." value={timeoutsA} icon={<Timer className="text-green-400" />} />
                    </div>
                </div>
                
                {/* Centro: Tiempo y Período */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-transparent text-xl md:text-3xl font-black px-2 md:px-4 py-2">
                    <span className="text-4xl md:text-5xl font-bold font-orbitron">{formatTime(time)}</span>
                    <div className="my-2 border-b-2 border-white/20 w-full"></div>
                    <span className="text-xs md:text-sm font-semibold uppercase tracking-widest">{getPeriodLabel(status, period)}</span>
                </div>

                {/* Equipo B (Visitante) */}
                 <div className="flex flex-col justify-between gap-2 p-2 flex-1 min-w-0 bg-[#c0392b]">
                    <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-wider uppercase leading-tight text-center truncate">{teamB.name}</h2>
                    <div className="flex items-center justify-around">
                         <div className="text-5xl md:text-7xl font-orbitron font-black">{scoreB}</div>
                        <Image src={teamB.logoUrl || ''} alt={`${teamB.name} logo`} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 object-contain flex-shrink-0" />
                    </div>
                     <div className="flex items-center justify-around pt-1 border-t border-white/10">
                        <StatDisplay label="T.M." value={timeoutsB} icon={<Timer className="text-green-400" />} />
                        <StatDisplay label="Faltas" value={foulsB} icon={<ShieldOff />} hasPenalty={foulsB >= 6} />
                    </div>
                </div>
            </div>
        </div>
    );
}
