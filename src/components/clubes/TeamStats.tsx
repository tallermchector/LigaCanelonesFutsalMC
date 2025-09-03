import type { Team } from '@/types';
import { CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface TeamStatsProps {
    team: Team;
}

const StatRow = ({ label, value }: { label: string, value: number | string }) => (
    <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
);

export function TeamStats({ team }: TeamStatsProps) {
    // Placeholder para futuras estadísticas
    const attackStats = [
        { label: "Goles Totales", value: 5 },
        { label: "Disparos", value: 31 },
        { label: "Asistencias", value: 4 },
        { label: "Penaltis Lanzados", value: 0 },
        { label: "Penaltis Recibidos", value: 0 },
    ];
    
    const teamPlayStats = [
        { label: "Pases", value: 1770 },
        { label: "Faltas Cometidas", value: 12 },
        { label: "Faltas Recibidas", value: 18 },
        { label: "Tarjetas Amarillas", value: 3 },
        { label: "Tarjetas Rojas", value: 1 },
    ];

    return (
        <CardContent className="p-4 md:p-6">
            <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-bold">ATAQUE</AccordionTrigger>
                    <AccordionContent className="divide-y divide-border">
                        {attackStats.map(stat => (
                            <StatRow key={stat.label} label={stat.label} value={stat.value} />
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-bold">JUEGO EN EQUIPO</AccordionTrigger>
                    <AccordionContent className="divide-y divide-border">
                         {teamPlayStats.map(stat => (
                            <StatRow key={stat.label} label={stat.label} value={stat.value} />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    );
}
