
import { getAllTeams } from '@/actions/team-actions';
import { PlayerCard } from '@/components/jugadores/PlayerCard';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import type { Player, Team } from '@/types';

interface PlayerWithTeam extends Player {
    team: Team;
}

export default async function JugadoresPage() {
  const teams: Team[] = await getAllTeams();
  
  // Aplanamos la lista de jugadores y añadimos la referencia del equipo a cada jugador
  const allPlayers: PlayerWithTeam[] = teams.flatMap(team => 
    team.players.map(player => ({
      ...player,
      team: { ...team, players: [] } // Evitamos la referencia circular completa
    }))
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Jugadores de la Liga"
          description="Descubre a las estrellas y talentos de todos los equipos."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {allPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
