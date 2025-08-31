
import { notFound } from 'next/navigation';
import { getMatchStats } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScoreSummary } from '@/components/partidos/estadisticas/ScoreSummary';
import { StatCard } from '@/components/partidos/estadisticas/StatCard';
import { EventsList } from '@/components/partidos/estadisticas/EventsList';
import { FutsalBallIcon } from '@/components/icons';
import { Hand } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';

interface EstadisticasPageProps {
  params: {
    id: string;
  };
}

export default async function EstadisticasPage({ params }: EstadisticasPageProps) {
  const match = await getMatchStats(params.id);

  if (!match) {
    notFound();
  }

  const topScorer = match.stats.topScorers[0];
  const assistsLeader = match.stats.assistsLeaders[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero title="Resumen del Partido">
            <div className="mt-8 max-w-5xl mx-auto w-full">
                <ScoreSummary match={match} />
            </div>
        </PageHero>

        <div className="container mx-auto px-4 py-8 md:py-12">
            <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Jugadores Destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard
                title="Goleador del Partido"
                icon={<FutsalBallIcon className="w-6 h-6 text-primary" />}
                value={topScorer ? topScorer.player.name : 'N/D'}
                description={topScorer ? `${topScorer.count} goles` : 'No hubo goles'}
                />
                <StatCard
                title="Líder en Asistencias"
                icon={<Hand className="w-6 h-6 text-blue-500" />}
                value={assistsLeader ? assistsLeader.player.name : 'N/D'}
                description={assistsLeader ? `${assistsLeader.count} asistencias` : 'No hubo asistencias'}
                />
            </div>
            </section>

            <section className="mt-12 max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Línea de Tiempo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <EventsList title="Goles" events={match.events || []} eventType="GOAL" />
                    <EventsList title="Faltas Cometidas" events={match.events || []} eventType="FOUL" />
                </div>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
