
'use client';

import type { MatchStats, GameEventType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
            <div className="flex justify-between items-center text-white font-bold text-sm md:text-base px-2 mb-1.5">
                <span className="tabular-nums">{valueA}</span>
                <span className="uppercase tracking-wider text-white/80">{label}</span>
                <span className="tabular-nums">{valueB}</span>
            </div>
            <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden flex justify-between">
                <motion.div
                    className="h-full bg-primary rounded-l-full"
                    variants={variantsA}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
                <motion.div
                    className="h-full bg-accent rounded-r-full"
                    variants={variantsB}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
            </div>
        </div>
    );
};

export function MatchSummaryStats({ match }: MatchSummaryStatsProps) {
    const { events = [], teamA, teamB } = match;

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
        <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white mt-8">
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-5">
                {statsData.map(stat => (
                    <StatBar key={stat.label} {...stat} />
                ))}
            </CardContent>
        </Card>
    );
}
