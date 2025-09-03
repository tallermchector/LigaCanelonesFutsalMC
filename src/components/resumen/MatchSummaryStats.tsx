
'use client';

import type { MatchStats, GameEventType, PlayerStat } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Hand, Target, User } from 'lucide-react';
import { FutsalBallIcon } from '../icons';
import Image from 'next/image';
import Link from 'next/link';

interface MatchSummaryStatsProps {
    match: MatchStats;
}

const StatBar = ({ label, valueA, valueB }: { label: string; valueA: number; valueB: number }) => {
    const total = valueA + valueB;
    const percentageA = total > 0 ? (valueA / total) * 100 : 0;
    const percentageB = total > 0 ? (valueB / total) * 100 : 0;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    
    const variantsA = {
      hidden: { width: '0%' },
      visible: { width: `${percentageA}%`, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } }
    };
    
    const variantsB = {
      hidden: { width: '0%' },
      visible: { width: `${percentageB}%`, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } }
    };

    return (
        <div ref={ref} className="w-full">
            <div className="flex justify-between items-center text-white font-bold text-sm md:text-base px-1 sm:px-2 mb-1.5">
                <span className="tabular-nums">{valueA}</span>
                <span className="uppercase tracking-wider text-white/80 text-xs sm:text-sm text-center">{label}</span>
                <span className="tabular-nums">{valueB}</span>
            </div>
            <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden flex justify-between">
                <motion.div
                    className="h-full bg-primary rounded-l-full"
                    style={{ background: `linear-gradient(90deg, hsl(var(--primary) / 0.7), hsl(var(--primary)))` }}
                    variants={variantsA}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
                <motion.div
                    className="h-full bg-accent rounded-r-full"
                    style={{ background: `linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent) / 0.7))` }}
                    variants={variantsB}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
            </div>
        </div>
    );
};

const StatLeaders = ({ title, icon, leaders }: { title: string, icon: React.ReactNode, leaders: PlayerStat[] }) => {
    if (!leaders || leaders.length === 0) return null;

    return (
        <div>
            <h3 className="flex items-center gap-2 font-bold text-lg mb-2">
                {icon}
                <span>{title}</span>
            </h3>
            <div className="space-y-2">
                {leaders.slice(0, 3).map(({ player, count }) => (
                     <Link key={player.id} href={`/jugadores/${player.id}`} className="block group">
                        <Card className="bg-black/20 border border-white/10 hover:bg-white/10 transition-colors">
                            <CardContent className="p-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                     <Image
                                        src={player.team?.logoUrl || '/placeholder-player.png'}
                                        alt={player.name}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 rounded-full object-cover bg-white/20 p-0.5"
                                    />
                                    <span className="font-semibold text-sm group-hover:text-primary">{player.name}</span>
                                </div>
                                <span className="font-bold text-lg tabular-nums">{count}</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export function MatchSummaryStats({ match }: MatchSummaryStatsProps) {
    const { events = [], teamA, teamB, stats } = match;

    const getStatCount = (teamId: number, eventType: GameEventType) => {
        return events.filter(e => {
            const playerTeam = teamA.players.some(p => p.id === e.playerId) ? 'A' : 'B';
            const targetTeamId = teamA.id === teamId ? 'A' : 'B';
            return playerTeam === targetTeamId && e.type === eventType;
        }).length;
    };
    
    const getTeamId = (team: 'A' | 'B') => {
        return team === 'A' ? match.teamA.id : match.teamB.id;
    }

    const statsData = [
        { label: 'Goles', valueA: match.scoreA, valueB: match.scoreB },
        { label: 'Asistencias', valueA: getStatCount(getTeamId('A'), 'ASSIST'), valueB: getStatCount(getTeamId('B'), 'ASSIST') },
        { label: 'Tiros al Arco', valueA: getStatCount(getTeamId('A'), 'SHOT'), valueB: getStatCount(getTeamId('B'), 'SHOT') },
        { label: 'Faltas', valueA: getStatCount(getTeamId('A'), 'FOUL'), valueB: getStatCount(getTeamId('B'), 'FOUL') },
        { label: 'Tarjetas Amarillas', valueA: getStatCount(getTeamId('A'), 'YELLOW_CARD'), valueB: getStatCount(getTeamId('B'), 'YELLOW_CARD') },
        { label: 'Tarjetas Rojas', valueA: getStatCount(getTeamId('A'), 'RED_CARD'), valueB: getStatCount(getTeamId('B'), 'RED_CARD') },
    ];
    
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Estadísticas del Partido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-5">
                    {statsData.map(stat => (
                        <StatBar key={stat.label} {...stat} />
                    ))}
                </CardContent>
            </Card>
            <div className="space-y-6">
                <StatLeaders title="Goleadores" icon={<FutsalBallIcon />} leaders={stats.topScorers} />
                <StatLeaders title="Asistencias" icon={<Hand />} leaders={stats.assistsLeaders} />
                <StatLeaders title="Tiros" icon={<Target />} leaders={stats.shotsByPlayer} />
            </div>
        </div>
    );
}
