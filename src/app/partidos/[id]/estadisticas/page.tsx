
import { notFound, redirect } from 'next/navigation';
import { getMatchStatsFromDb } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EventsList } from '@/components/partidos/estadisticas/EventsList';
import type { Metadata } from 'next';
import { MatchSummaryHeader } from '@/components/resumen/MatchSummaryHeader';
import { MatchSummaryStats } from '@/components/resumen/MatchSummaryStats';

interface EstadisticasPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EstadisticasPageProps): Promise<Metadata> {
  const { id } = params;
  const match = await getMatchStatsFromDb(id);

  if (!match || match.status !== 'FINISHED') {
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
  const { id } = params;
  const match = await getMatchStatsFromDb(id);

  if (!match) {
    notFound();
  }
  
  if (match.status !== 'FINISHED') {
      redirect('/partidos');
  }

  const allEvents = (match.events || []).sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main 
        className="flex-1 pt-[var(--header-height)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
      >
        <div className="bg-black/70 min-h-full">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <MatchSummaryHeader match={match} />
                    <MatchSummaryStats match={match} />

                    <section className="mt-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">Línea de Tiempo</h2>
                        <EventsList 
                          events={allEvents} 
                          teamALogo={match.teamA.logoUrl || ''} 
                          teamBLogo={match.teamB.logoUrl || ''}
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
