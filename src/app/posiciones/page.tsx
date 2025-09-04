
'use client';

import { getStandings } from '@/actions/season-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { StandingsTable } from '@/components/posiciones/StandingsTable';
import { PlayerRanking } from '@/components/jugadores/PlayerRanking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Team, SeasonTeam, FullMatch, Player } from '@/types';
import { useEffect, useState } from 'react';
import { getAllTeams } from '@/actions/team-actions';
import { ScheduleCalendar } from '@/components/posiciones/ScheduleCalendar';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import { Trophy } from 'lucide-react';

interface PlayerWithStats extends Player {
    goals: number;
    team: Team;
}

export default function PosicionesPage() {
  const [standings, setStandings] = useState<(SeasonTeam & { team: Team })[]>([]);
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);

        const standingsData = await getStandings(1);
        const typedStandings = standingsData as (SeasonTeam & { team: Team })[];
        setStandings(typedStandings);
        
        const teamsData = await getAllTeams();
        const allPlayers = teamsData.flatMap(team =>
            team.players.map(player => ({
                ...player,
                team: { ...team }, // Clonamos para asegurar el tipo correcto
                goals: Math.floor(Math.random() * 15) // Simular goles
            }))
        );
        allPlayers.sort((a, b) => b.goals - a.goals);
        setPlayers(allPlayers as PlayerWithStats[]);
        
        const matchesData = await getAllMatchesFromDb();
        setMatches(matchesData as FullMatch[]);

        setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <div className="max-w-7xl mx-auto">
                  <div className="text-left mb-12">
                     <Trophy className="h-12 w-12 text-primary" />
                     <h1 className="text-4xl font-bold font-orbitron mt-4">Clasificación y Estadísticas</h1>
                     <p className="text-muted-foreground mt-2">Analiza el rendimiento de los equipos y jugadores de la liga.</p>
                 </div>
          <Tabs defaultValue="clasificacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg bg-muted/50">
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
              <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
            </TabsList>
            <TabsContent value="calendario" className="mt-6">
                 {loading ? (
                    <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
                ) : (
                    <ScheduleCalendar matches={matches} />
                )}
            </TabsContent>
            <TabsContent value="clasificacion" className="mt-6">
                 {loading ? (
                    <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
                ) : (
                    <StandingsTable standings={standings} />
                )}
            </TabsContent>
            <TabsContent value="ranking" className="mt-6">
                {loading ? (
                    <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
                ) : (
                    <PlayerRanking players={players} />
                )}
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
