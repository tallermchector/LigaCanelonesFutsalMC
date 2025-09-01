
'use client';

import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { FinishedMatchCard } from '@/components/landing/FinishedMatchCard';
import { useEffect, useState } from 'react';
import { FullMatch } from '@/types';


export default function ResumenSelectionPage() {
  const [finishedMatches, setFinishedMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatchesFromDb().then(matches => {
        setFinishedMatches(matches.filter(m => m.status === 'FINISHED'));
        setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Resumen de Partidos"
          description="Explora las estadísticas detalladas de los partidos finalizados."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            {finishedMatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {finishedMatches.map(match => (
                         <FinishedMatchCard key={match.id} match={match} />
                    ))}
                </div>
            ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                    <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos finalizados.</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Vuelve más tarde para ver los resúmenes.</p>
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
