
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
        <div className="container mx-auto max-w-6xl -mt-16 pb-12">
            <Tabs defaultValue="players" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm border rounded-lg shadow-lg">
                    <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                    <TabsTrigger value="players">Jugadores</TabsTrigger>
                    <TabsTrigger value="schedule">Calendario</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <Card>
                        <TabsContent value="stats" className="mt-0">
                            <TeamStats team={team} />
                        </TabsContent>
                        <TabsContent value="players" className="mt-0">
                            <TeamPlayers players={team.players || []} />
                        </TabsContent>
                        <TabsContent value="schedule" className="mt-0">
                            <TeamSchedule matches={team.matches || []} />
                        </TabsContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    );
}
