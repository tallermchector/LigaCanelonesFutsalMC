
'use client';

import Image from 'next/image';
import { Timer, ShieldOff } from 'lucide-react';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, MatchStatus } from '@/types';
import { cn } from '@/lib/utils';

// --- Icono Personalizado para el Marcador ---
// Este icono simula el "0" tachado de los marcadores digitales.
const SlashedZeroIcon = ({ className }: { className?: string }) => (
    <svg 
        className={cn("text-3xl md:text-5xl font-orbitron", className)}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
);


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
        <div className="flex items-center gap-2">
            <div className={cn('h-6 w-6', hasPenalty ? 'text-red-500' : 'text-white/80')}>
                {icon}
            </div>
            <span className={cn('text-xl font-bold', hasPenalty ? 'text-red-500' : 'text-white')}>
                {value}
            </span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</span>
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
    
    // El logo de la liga se puede pasar como prop o definirlo aquí
    const leagueLogo = '/logofu.png';

    return (
        <div className="font-sans w-full max-w-5xl mx-auto flex flex-col items-center p-4">
            {/* Logo de la Liga */}
            <div className="relative z-10 mb-[-28px] bg-[#1a212e] p-1 rounded-full border-4 border-[#1a212e] shadow-lg">
                <Image src={leagueLogo} alt="League Logo" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-contain"/>
            </div>

            {/* Marcador Principal */}
            <div className="w-full text-white shadow-2xl rounded-lg overflow-hidden flex items-stretch justify-between h-auto md:h-24 bg-[#1a212e]">
                
                {/* Equipo A (Local) */}
                <div className="flex items-center justify-start gap-2 md:gap-4 p-2 md:p-4 flex-1 min-w-0 bg-[#2c3e50] rounded-l-lg">
                    <Image src={teamA.logoUrl || ''} alt={`${teamA.name} logo`} width={56} height={56} className="w-10 h-10 md:w-14 md:h-14 object-contain flex-shrink-0" />
                    <h2 className="text-sm sm:text-base md:text-xl font-extrabold tracking-wider uppercase leading-tight text-left flex-grow">{teamA.name}</h2>
                </div>
                
                {/* Centro: Marcador y Tiempo */}
                <div className="flex-shrink-0 flex items-center justify-center bg-[#c0392b] text-xl md:text-3xl font-black px-2 md:px-6 gap-3 md:gap-4">
                    {scoreA === 0 ? <SlashedZeroIcon /> : <span className="text-3xl md:text-5xl font-orbitron">{scoreA}</span>}
                    <div className="flex flex-col items-center text-center leading-tight">
                        <span className="text-xs md:text-sm font-bold uppercase">{getPeriodLabel(status, period)}</span>
                        <span className="text-2xl md:text-3xl font-bold font-orbitron">{formatTime(time)}</span>
                    </div>
                    {scoreB === 0 ? <SlashedZeroIcon /> : <span className="text-3xl md:text-5xl font-orbitron">{scoreB}</span>}
                </div>

                {/* Equipo B (Visitante) */}
                <div className="flex items-center justify-end gap-2 md:gap-4 p-2 md:p-4 flex-1 min-w-0 bg-[#2c3e50] rounded-r-lg">
                    <h2 className="text-sm sm:text-base md:text-xl font-extrabold tracking-wider uppercase leading-tight text-right flex-grow">{teamB.name}</h2>
                    <Image src={teamB.logoUrl || ''} alt={`${teamB.name} logo`} width={56} height={56} className="w-10 h-10 md:w-14 md:h-14 object-contain flex-shrink-0" />
                </div>
            </div>
            
            {/* Sección de Estadísticas Inferiores */}
            <div className="w-full grid grid-cols-2 gap-4 px-4 md:px-8 mt-4">
                {/* Estadísticas Equipo A */}
                <div className="flex items-center justify-start gap-4 md:gap-8">
                    <StatDisplay label="Faltas" value={foulsA} icon={<ShieldOff />} hasPenalty={foulsA >= 6} />
                    <StatDisplay label="T.M." value={timeoutsA} icon={<Timer className="text-green-400" />} />
                </div>
                {/* Estadísticas Equipo B */}
                <div className="flex items-center justify-end gap-4 md:gap-8">
                    <StatDisplay label="T.M." value={timeoutsB} icon={<Timer className="text-green-400" />} />
                    <StatDisplay label="Faltas" value={foulsB} icon={<ShieldOff />} hasPenalty={foulsB >= 6} />
                </div>
            </div>
        </div>
    );
}
