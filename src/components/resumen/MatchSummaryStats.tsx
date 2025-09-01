
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
    const percentageA = total > 0 ? (valueA / total) * 100 : 50;

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    
    const variantsA = {
      hidden: { width: '0%' },
      visible: { width: `${percentageA}%`, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    const variantsB = {
      hidden: { width: '0%' },
      visible: { width: `${100 - percentageA}%`, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    return (
        <div ref={ref} className="w-full">
            <div className="flex justify-between items-center text-white font-bold text-sm md:text-base px-2 mb-1.5">
                <span className="tabular-nums">{valueA}</span>
                <span className="uppercase tracking-wider text-white/80">{label}</span>
                <span className="tabular-nums">{valueB}</span>
            </div>
            <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden flex">
                <motion.div
                    className="h-full bg-primary"
                    variants={variantsA}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
                <motion.div
                    className="h-full bg-accent"
                    variants={variantsB}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                />
            </div>
        </div>
    );
};

export function MatchSummaryStats({ match }: MatchSummaryStatsProps) {
    const { events = [] } = match;

    const getStatCount = (teamId: 'A' | 'B', eventType: GameEventType) => {
        return events.filter(e => e.teamId === teamId && e.type === eventType).length;
    };

    const statsData = [
        { label: 'Goles', valueA: match.scoreA, valueB: match.scoreB },
        { label: 'Asistencias', valueA: getStatCount('A', 'ASSIST'), valueB: getStatCount('B', 'ASSIST') },
        { label: 'Tiros al Arco', valueA: getStatCount('A', 'SHOT'), valueB: getStatCount('B', 'SHOT') },
        { label: 'Faltas', valueA: getStatCount('A', 'FOUL'), valueB: getStatCount('B', 'FOUL') },
        { label: 'Tarjetas Amarillas', valueA: getStatCount('A', 'YELLOW_CARD'), valueB: getStatCount('B', 'YELLOW_CARD') },
        { label: 'Tarjetas Rojas', valueA: getStatCount('A', 'RED_CARD'), valueB: getStatCount('B', 'RED_CARD') },
    ];
    
    return (
        <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white">
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-5">
                {statsData.map(stat => (
                    <StatBar key={stat.label} {...stat} />
                ))}
            </CardContent>
        </Card>
    );
}
