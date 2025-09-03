
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { getMatchByIdFromDb, saveMatchState, createGameEvent } from '@/actions/prisma-actions';
import type { FullMatch, MatchStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { GameProvider, useGame } from '@/contexts/GameProvider';
import { Scoreboard } from '@/components/controles/Scoreboard';
import { GameControls } from '@/components/controles/GameControls';
import { StarterSelection } from '@/components/controles/StarterSelection';


function MatchControlContent() {
    const { state } = useGame();

    if (state.status === 'SELECTING_STARTERS') {
        return <StarterSelection />;
    }

    return (
        <>
            <div className="flex-shrink-0 w-full max-w-7xl mx-auto">
                <Scoreboard />
            </div>
            <div className="flex-grow pt-4 w-full max-w-7xl mx-auto">
                <GameControls />
            </div>
        </>
    );
}

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
          const matchId = parseInt(id, 10);
          if (isNaN(matchId)) {
            setError('ID de partido inválido.');
            return;
          }
          const fetchedMatch = await getMatchByIdFromDb(matchId);
          if (fetchedMatch) {
            // Ensure status is what we expect
             if (fetchedMatch.status === 'SCHEDULED') {
              fetchedMatch.status = 'SELECTING_STARTERS';
            }
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
            <main className="container mx-auto py-8 px-4 pt-[var(--header-height)]">
                <MatchControlSkeleton />
            </main>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
        <Header />
        <div className="container mx-auto py-8 px-4 text-center pt-[var(--header-height)]">
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
    <GameProvider 
        match={match} 
        saveMatchState={saveMatchState}
        createGameEvent={createGameEvent}
    >
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-4 flex-grow flex flex-col h-main-content pt-[var(--header-height)]">
           <div className="w-full flex justify-start mb-4 max-w-7xl mx-auto flex-shrink-0">
              <Button variant="outline" asChild>
                  <Link href="/controles">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver a Controles
                  </Link>
              </Button>
          </div>
          <MatchControlContent />
        </main>
      </div>
    </GameProvider>
  );
}
