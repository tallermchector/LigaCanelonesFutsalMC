
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatRow = ({ label, value }: { label: string; value: string | number; }) => (
    <div className="flex items-baseline justify-between px-6 py-4">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-primary">
            {value}
        </p>
    </div>
);

export function PlayerStats() {
    // Placeholder data
    const stats = [
        { label: 'Partidos Jugados', value: 3 },
        { label: 'Minutos Jugados', value: 120 },
        { label: 'Goles', value: 2 },
        { label: 'Asistencias', value: 1 },
        { label: 'Remates', value: 8 },
        { label: 'Faltas', value: 4 },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Estadísticas Destacadas
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y">
                {stats.map(stat => (
                     <StatRow key={stat.label} label={stat.label} value={stat.value} />
                ))}
            </CardContent>
        </Card>
    )
}
