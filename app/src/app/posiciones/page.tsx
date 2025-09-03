
'use client';

import { getStandings } from '@/actions/season-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { StandingsTable } from '@/components/posiciones/StandingsTable';
import { PlayerRanking } from '@/components/jugadores/PlayerRanking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Team, SeasonTeam as SeasonTeamWithTeam, FullMatch } from '@/types';
import { useEffect, useState } from 'react';
import { getAllTeams } from '@/actions/team-actions';
import type { Player } from '@/types';
import { ScheduleCalendar } from '@/components/posiciones/ScheduleCalendar';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';

interface PlayerWithStats extends Player {
    goals: number;
    team: Team;
}

export default function PosicionesPage() {
  const [standings, setStandings] = useState<(SeasonTeamWithTeam & { team: Team })[]>([]);
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);

        const standingsData = await getStandings(1);
        const typedStandings = standingsData as (SeasonTeamWithTeam & { team: Team })[];
        setStandings(typedStandings);
        
        const teamsData = await getAllTeams();
        const allPlayers = teamsData.flatMap(team =>
            team.players.map(player => ({
                ...player,
                team: { ...team, players: [] }, // Evita la circularidad
                goals: Math.floor(Math.random() * 15) // Simular goles
            }))
        );
        allPlayers.sort((a, b) => b.goals - a.goals);
        setPlayers(allPlayers);
        
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
        <PageHero
          title="Tabla de Posiciones"
          description="Sigue la clasificación de los equipos a lo largo de la temporada."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
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
      </main>
      <Footer />
    </div>
  );
}
