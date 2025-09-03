
'use client';

import { getAllTeams } from '@/actions/team-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { PlayerRanking } from '@/components/jugadores/PlayerRanking';
import type { Team, Player } from '@/types';
import { useEffect, useState } from 'react';

interface PlayerWithStats extends Player {
    goals: number;
    team: Team;
}

export default function JugadoresPage() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    fetchData();
  }, []);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Ranking de Jugadores"
          description="Descubre a las estrellas y talentos destacados de la liga."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
           {loading ? (
              <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
          ) : (
              <PlayerRanking players={players} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
