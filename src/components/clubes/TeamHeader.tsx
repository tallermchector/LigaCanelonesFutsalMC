
'use client';

import type { Team } from '@/types';
import Image from 'next/image';
import { Users, BarChart2, Clock, Goal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: number | string }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/20 backdrop-blur-sm text-white">
        <Icon className="h-8 w-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
    </div>
)

export const TeamHeader = ({ team }: { team: Team }) => {
    const finishedMatches = team.matches?.filter(m => m.status === 'FINISHED') || [];
    const totalMatchesPlayed = finishedMatches.length;

    const totalMinutesPlayed = finishedMatches.reduce((acc) => {
        // Assuming each match is 40 minutes (2 periods of 20 minutes)
        // This could be more accurate if match duration is stored
        return acc + 40; 
    }, 0);

    const totalGoalsScored = finishedMatches.reduce((acc, match) => {
        if (match.teamAId === team.id) return acc + (match.scoreA || 0);
        if (match.teamBId === team.id) return acc + (match.scoreB || 0);
        return acc;
    }, 0);

    const averageGoals = totalMatchesPlayed > 0 ? (totalGoalsScored / totalMatchesPlayed).toFixed(1) : '0';


  return (
    <section 
        className="relative bg-secondary/30 py-16 text-foreground bg-cover bg-center"
        style={{ backgroundImage: team.bannerUrl ? `url(${team.bannerUrl})` : "none" }}
    >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <Image
                     src={team.logoUrl || '/logofu.svg'}
                     alt={team.name}
                     width={150}
                     height={150}
                     className="rounded-full border-4 border-primary shadow-2xl bg-white/10"
                />
                <div className="text-center md:text-left">
                    <p className="text-primary font-semibold">Equipo de la Liga</p>
                    <h1 className="text-5xl lg:text-7xl font-bold font-orbitron mt-1">{team.name}</h1>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 border-t border-primary/20 pt-8">
                <Stat icon={Users} label="Jugadores" value={team.players.length} />
                <Stat icon={BarChart2} label="Partidos Jugados" value={totalMatchesPlayed} />
                <Stat icon={Clock} label="Minutos Jugados" value={totalMinutesPlayed} />
                <Stat icon={Goal} label="Prom. Goles" value={averageGoals} />
            </div>
         </div>
    </section>
  );
};
