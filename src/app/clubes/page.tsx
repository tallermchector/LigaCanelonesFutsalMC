
import { getAllTeams } from '@/actions/team-actions';
import { TeamCard } from '@/components/clubes/TeamCard';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import type { Team } from '@/types';
import { Shield } from 'lucide-react';

export default async function ClubesPage() {
  const teams: Team[] = await getAllTeams();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8 pt-[var(--header-height)]">
         <div className="max-w-6xl mx-auto">
            <div className="text-left mb-12">
                <Shield className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold font-orbitron mt-4">Equipos de la Liga</h1>
                <p className="text-muted-foreground mt-2">Conoce a todos los equipos que compiten en la temporada activa.</p>
            </div>

            {teams.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {teams.map(team => (
                      <TeamCard key={team.id} team={team} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No se encontraron equipos.</p>
              </div>
            )}
       </div>
      </main>
      <Footer />
    </div>
  );
}
