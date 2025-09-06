
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamStats } from './TeamStats';
import { TeamPlayers } from './TeamPlayers';
import { TeamSchedule } from './TeamSchedule';
import type { Team } from '@/types';
import { Card } from '../ui/card';

interface TeamTabsProps {
    team: Team;
}

export function TeamTabs({ team }: TeamTabsProps) {
    return (
        <Card className="shadow-lg border-none">
            <Tabs defaultValue="players" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/60">
                    <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                    <TabsTrigger value="players">Jugadores</TabsTrigger>
                    <TabsTrigger value="schedule">Calendario</TabsTrigger>
                </TabsList>
                <TabsContent value="stats">
                    <TeamStats team={team} />
                </TabsContent>
                <TabsContent value="players">
                    <TeamPlayers players={team.players || []} />
                </TabsContent>
                <TabsContent value="schedule">
                    <TeamSchedule matches={team.matches || []} />
                </TabsContent>
            </Tabs>
        </Card>
    );
}
