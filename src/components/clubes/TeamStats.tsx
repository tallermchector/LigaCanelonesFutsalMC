
import type { Team, GameEvent, GameEventType } from '@/types';
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
    const getTeamEvents = (eventType: GameEventType): GameEvent[] => {
        if (!team.matches) return [];
        return team.matches.flatMap(match =>
            match.events.filter(event =>
                event.type === eventType &&
                (event.teamId === team.id || 
                 (match.teamAId === team.id && event.teamId === match.teamA.id) || 
                 (match.teamBId === team.id && event.teamId === match.teamB.id))
            )
        );
    };

    const goals = team.matches?.reduce((acc, match) => {
        if (match.teamAId === team.id) return acc + (match.scoreA || 0);
        if (match.teamBId === team.id) return acc + (match.scoreB || 0);
        return acc;
    }, 0) || 0;

    const attackStats = [
        { label: "Goles Totales", value: goals },
        { label: "Disparos", value: getTeamEvents('SHOT').length },
        { label: "Asistencias", value: getTeamEvents('ASSIST').length },
    ];
    
    const teamPlayStats = [
        { label: "Faltas Cometidas", value: getTeamEvents('FOUL').length },
        { label: "Tarjetas Amarillas", value: getTeamEvents('YELLOW_CARD').length },
        { label: "Tarjetas Rojas", value: getTeamEvents('RED_CARD').length },
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
