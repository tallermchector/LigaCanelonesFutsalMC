
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FullMatch } from '@/types';
import { BarChart, Clock, Hash } from 'lucide-react';

interface LeagueStatsProps {
    matches: FullMatch[];
}

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-primary">{value}</div>
        </CardContent>
    </Card>
);

export function LeagueStats({ matches }: LeagueStatsProps) {
    const finishedMatches = matches.filter(m => m.status === 'FINISHED');
    const totalMatches = finishedMatches.length;
    // Assuming each match is 40 minutes long (20 mins per period)
    const totalMinutes = totalMatches * 40; 
    const averageMinutes = totalMatches > 0 ? (totalMinutes / totalMatches).toFixed(0) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard 
                title="Partidos Jugados" 
                value={totalMatches} 
                icon={<Hash className="h-4 w-4" />}
            />
            <StatCard 
                title="Minutos Totales Disputados" 
                value={`${totalMinutes}`} 
                icon={<Clock className="h-4 w-4" />}
            />
            <StatCard 
                title="Promedio por Partido" 
                value={`${averageMinutes} min`} 
                icon={<BarChart className="h-4 w-4" />}
            />
        </div>
    );
}
