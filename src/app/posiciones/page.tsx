
import { getStandings } from '@/actions/season-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { StandingsTable } from '@/components/posiciones/StandingsTable';
import type { Team } from '@prisma/client';
import type { SeasonTeam as SeasonTeamWithTeam } from '@prisma/client';

export default async function PosicionesPage() {
  // Usamos un ID de temporada fijo (1) como se especificó.
  // Esto deberá ser dinámico en el futuro.
  const standings = await getStandings(1);

  // Aseguramos el tipo para el componente
  const typedStandings = standings as (SeasonTeamWithTeam & { team: Team })[];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Tabla de Posiciones"
          description="Sigue la clasificación de los equipos a lo largo de la temporada."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
          <StandingsTable standings={typedStandings} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
