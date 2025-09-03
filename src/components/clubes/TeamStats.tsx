import type { Team } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamStatsProps {
    team: Team;
}

export function TeamStats({ team }: TeamStatsProps) {
    // Placeholder para futuras estadísticas
    const stats = {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
    };

    return (
        <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas de la Temporada</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard title="Partidos Jugados" value={stats.played} />
                <StatCard title="Victorias" value={stats.wins} />
                <StatCard title="Empates" value={stats.draws} />
                <StatCard title="Derrotas" value={stats.losses} />
                <StatCard title="Goles a Favor" value={stats.goalsFor} />
                <StatCard title="Goles en Contra" value={stats.goalsAgainst} />
            </div>
        </CardContent>
    );
}

function StatCard({ title, value }: { title: string, value: number | string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}