
import { getAllTeams } from '@/actions/team-actions';
import { TeamCard } from '@/components/clubes/TeamCard';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import type { Team } from '@/types';

export default async function ClubesPage() {
  const teams: Team[] = await getAllTeams();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Nuestros Clubes"
          description="Conoce a todos los equipos que forman parte de la Liga Canelones Futsal."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
