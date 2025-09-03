
'use client';

import { getStandings } from '@/actions/season-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { PageHero } from '@/components/layout/PageHero';
import { StandingsTable } from '@/components/posiciones/StandingsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Team, SeasonTeam as SeasonTeamWithTeam } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function PosicionesPage() {
  // Usamos un ID de temporada fijo (1) como se especificó.
  const [standings, setStandings] = useState<(SeasonTeamWithTeam & { team: Team })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStandings(1).then(data => {
      // Aseguramos el tipo para el componente
      const typedStandings = data as (SeasonTeamWithTeam & { team: Team })[];
      setStandings(typedStandings);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Tabla de Posiciones"
          description="Sigue la clasificación de los equipos a lo largo de la temporada."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
          <Tabs defaultValue="clasificacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-lg bg-muted/50">
              <TabsTrigger value="calendario" disabled>Calendario</TabsTrigger>
              <TabsTrigger value="clasificacion">Clasificación</TabsTrigger>
              <TabsTrigger value="ranking" disabled>Ranking</TabsTrigger>
            </TabsList>
            <TabsContent value="clasificacion" className="mt-6">
                 {loading ? (
                    <div className="w-full h-96 bg-muted rounded-lg animate-pulse" />
                ) : (
                    <StandingsTable standings={standings} />
                )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
