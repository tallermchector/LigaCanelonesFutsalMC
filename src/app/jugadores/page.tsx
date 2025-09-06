
'use client';

import { getAllMatches } from '@/actions/prisma-actions';
import { getMatchStats } from '@/actions/prisma-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { PlayerRanking } from '@/components/jugadores/PlayerRanking';
import type { PlayerWithStats, FullMatch, PlayerStat } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getAggregatedPlayerStats(): Promise<PlayerWithStats[]> {
    const allMatches = await getAllMatches();
    const finishedMatches = allMatches.filter(m => m.status === 'FINISHED');

    const playerStatsMap: { [playerId: number]: { player: PlayerStat['player'], goals: number, assists: number, matchesPlayed: number } } = {};

    for (const match of finishedMatches) {
        const stats = await getMatchStats(match.id);
        if (!stats) continue;

        const processStats = (statArray: PlayerStat[], type: 'goals' | 'assists') => {
            statArray.forEach(stat => {
                if (!playerStatsMap[stat.player.id]) {
                    playerStatsMap[stat.player.id] = {
                        player: stat.player,
                        goals: 0,
                        assists: 0,
                        matchesPlayed: 0,
                    };
                }
                playerStatsMap[stat.player.id][type] += stat.count;
            });
        };

        processStats(stats.stats.topScorers, 'goals');
        processStats(stats.stats.assistsLeaders, 'assists');

        const playersInMatch = new Set<number>();
        stats.events.forEach(event => {
            if (event.playerId) playersInMatch.add(event.playerId);
        });

        playersInMatch.forEach(playerId => {
             if (playerStatsMap[playerId]) {
                playerStatsMap[playerId].matchesPlayed += 1;
            }
        });
    }

    return Object.values(playerStatsMap).map(p => ({
        ...p.player,
        goals: p.goals,
        assists: p.assists,
        matchesPlayed: p.matchesPlayed,
    }));
}


export default function JugadoresPage() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const aggregatedStats = await getAggregatedPlayerStats();
        aggregatedStats.sort((a, b) => b.goals - a.goals);
        setPlayers(aggregatedStats);
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
