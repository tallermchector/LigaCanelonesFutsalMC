
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { getMatchById } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { GameProvider } from '@/contexts/GameProvider';
import { Scoreboard } from '@/components/controles/Scoreboard';
import { GameControls } from '@/components/controles/GameControls';
import { EventButtons } from '@/components/controles/EventButtons';

function MatchControlSkeleton() {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-40 w-full mb-8" />
        <div className="flex gap-8">
            <Skeleton className="h-80 flex-1" />
            <Skeleton className="h-80 w-full max-w-sm" />
            <Skeleton className="h-80 flex-1" />
        </div>
      </div>
    );
}

export default function MatchControlPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [match, setMatch] = useState<FullMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      async function loadMatch() {
        setLoading(true);
        setError(null);
        try {
          const fetchedMatch = await getMatchById(id);
          if (fetchedMatch) {
            setMatch(fetchedMatch);
          } else {
            setError('Partido no encontrado.');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'No se pudo cargar el partido.';
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
      loadMatch();
    }
  }, [id, toast]);
  
  if (loading) {
    return (
        <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
            <Header />
            <main className="container mx-auto py-8 px-4">
                <MatchControlSkeleton />
            </main>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
        <Header />
        <div className="container mx-auto py-8 px-4 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild className="mt-4">
                <Link href="/controles">Volver a Controles</Link>
            </Button>
        </div>
      </div>
    );
  }
  
  if (!match) return null;

  return (
    <GameProvider match={match}>
      <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
        <Header />
        <main className="container mx-auto py-8 px-4 flex flex-col items-center flex-grow">
          <div className="w-full flex justify-start mb-4 max-w-6xl">
            <Button variant="outline" asChild>
              <Link href="/controles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Controles
              </Link>
            </Button>
          </div>
          <div className="w-full max-w-6xl mb-4">
            <Scoreboard />
          </div>
           <div className="w-full max-w-4xl mb-4">
            <EventButtons />
          </div>
          <div className="w-full max-w-6xl flex-grow">
            <GameControls />
          </div>
        </main>
      </div>
    </GameProvider>
  );
}
