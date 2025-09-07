
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
        <div className="container mx-auto max-w-6xl pb-12 relative z-10 -mt-10">
            <Tabs defaultValue="players" className="w-full">
                <TabsList className="w-full flex-wrap justify-center h-auto bg-card/80 backdrop-blur-sm border rounded-lg shadow-lg p-1">
                    <TabsTrigger value="stats" className="flex-1">Estadísticas</TabsTrigger>
                    <TabsTrigger value="players" className="flex-1">Jugadores</TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1">Calendario</TabsTrigger>
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
