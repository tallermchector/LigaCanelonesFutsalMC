
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ControlMatchCard } from '@/components/controles/ControlMatchCard';
import { MatchListSkeleton } from '@/components/controles/MatchListSkeleton';
import { useToast } from '@/hooks/use-toast';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import type { FullMatch, MatchStatus } from '@/types';

export default function ControlesPage() {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MatchStatus | 'ALL'>('LIVE');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      setError(null);
      try {
        const fetchedMatches = await getAllMatchesFromDb();
        setMatches(fetchedMatches);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los partidos.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error de Carga',
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [toast]);

  const filteredMatches = matches.filter((m) => activeTab === 'ALL' || m.status === activeTab);

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />
      <main className="container mx-auto py-8 px-4 pt-[var(--header-height)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">
            Control de Partidos
            </h1>
            <Tabs
            defaultValue="LIVE"
            onValueChange={(value) => setActiveTab(value as MatchStatus)}
            aria-label="Filtrar partidos por estado"
            className="w-full sm:w-auto"
            >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="SCHEDULED" role="tab">
                Programados
                </TabsTrigger>
                <TabsTrigger value="LIVE" role="tab">
                En Vivo
                </TabsTrigger>
                <TabsTrigger value="FINISHED" role="tab">
                Finalizados
                </TabsTrigger>
            </TabsList>
            </Tabs>
        </div>

        {loading ? (
          <MatchListSkeleton />
        ) : error ? (
          <div className="flex justify-center items-center h-40 text-center text-red-500 bg-red-500/10 rounded-lg">
            <p>Error: {error}</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <ControlMatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 text-center text-muted-foreground bg-secondary/50 rounded-lg">
            <p>No hay partidos en este estado.</p>
          </div>
        )}
      </main>
    </div>
  );
}
