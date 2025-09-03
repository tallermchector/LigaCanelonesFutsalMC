
import { notFound, redirect } from 'next/navigation';
import { getMatchStatsFromDb } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventsList } from '@/components/partidos/estadisticas/EventsList';
import type { Metadata } from 'next';
import { ScoreSummary } from '@/components/partidos/estadisticas/ScoreSummary';
import { MatchSummaryStats } from '@/components/resumen/MatchSummaryStats';
import type { Team } from '@/types';


interface EstadisticasPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EstadisticasPageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return { title: 'Estadísticas no encontradas' };
  }
  const match = await getMatchStatsFromDb(id);

  if (!match) {
    return {
      title: 'Estadísticas no encontradas',
    };
  }

  const title = `Estadísticas: ${match.teamA.name} vs ${match.teamB.name}`;
  const description = `Estadísticas completas y resumen del partido de futsal entre ${match.teamA.name} y ${match.teamB.name}, resultado final ${match.scoreA} - ${match.scoreB}.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function EstadisticasPage({ params }: EstadisticasPageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
      notFound();
  }
  const match = await getMatchStatsFromDb(id);

  if (!match) {
    notFound();
  }
  
  if (match.status === 'SCHEDULED') {
      redirect('/partidos');
  }

  const allEvents = (match.events || []).sort((a, b) => a.timestamp - b.timestamp);
  
  // A placeholder function to generate a gradient from team colors
  // In a real app, you would fetch these colors from your DB.
  const getTeamGradient = (teamA: Team, teamB: Team) => {
      const colorA = teamA.logoUrl?.includes('1.png') ? '#FF0000' : '#0000FF';
      const colorB = teamB.logoUrl?.includes('10.png') ? '#FFFF00' : '#00FF00';
      return `linear-gradient(135deg, ${colorA}40, ${colorB}40)`;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main 
        className="flex-1 pt-[var(--header-height)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
      >
        <div className="bg-black/80 backdrop-blur-sm min-h-full">
            <div className="container mx-auto px-2 sm:px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <ScoreSummary match={match} />
                    <MatchSummaryStats match={match} />

                    <section className="mt-8 md:mt-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">Línea de Tiempo</h2>
                        <EventsList 
                          events={allEvents} 
                          teamA={match.teamA}
                          teamB={match.teamB}
                        />
                    </section>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
