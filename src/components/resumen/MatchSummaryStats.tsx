
import type { MatchStats, GameEvent, GameEventType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface MatchSummaryStatsProps {
    match: MatchStats;
}

const StatBar = ({ label, valueA, valueB }: { label: string; valueA: number; valueB: number }) => {
    const total = valueA + valueB;
    const percentageA = total > 0 ? (valueA / total) * 100 : 50;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center text-white font-bold text-sm md:text-base px-2 mb-1">
                <span>{valueA}</span>
                <span className="uppercase tracking-wider">{label}</span>
                <span>{valueB}</span>
            </div>
            <div className="h-4 md:h-5 w-full bg-gray-600/50 rounded-full overflow-hidden flex">
                <div
                    className="h-full bg-red-600 transition-all duration-500"
                    style={{ width: `${percentageA}%` }}
                ></div>
                <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${100 - percentageA}%` }}
                ></div>
            </div>
        </div>
    );
};

export function MatchSummaryStats({ match }: MatchSummaryStatsProps) {
    const { teamA, teamB, events = [] } = match;

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
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                {statsData.map(stat => (
                    <StatBar key={stat.label} {...stat} />
                ))}
            </CardContent>
        </Card>
    );
}
