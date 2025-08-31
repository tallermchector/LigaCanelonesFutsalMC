'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { getMatchById } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

function MatchControlSkeleton() {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-8 w-32 mb-8" />
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-6 text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-12 w-48" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
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

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [matchTime, setMatchTime] = useState(0);

  useEffect(() => {
    if (id) {
      async function loadMatch() {
        setLoading(true);
        setError(null);
        try {
          const fetchedMatch = await getMatchById(id);
          if (fetchedMatch) {
            setMatch(fetchedMatch);
            setScoreA(fetchedMatch.scoreA);
            setScoreB(fetchedMatch.scoreB);
            if (fetchedMatch.status === 'LIVE') {
              // Simulate match time for live games
              const startTime = new Date(fetchedMatch.scheduledTime).getTime();
              const now = Date.now();
              const elapsedMinutes = Math.floor((now - startTime) / (1000 * 60));
              setMatchTime(elapsedMinutes);
            }
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

  const handleScoreChange = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
    setter(prev => Math.max(0, prev + delta));
  };
  
  if (loading) {
    return (
        <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
            <Header />
            <MatchControlSkeleton />
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
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Button variant="outline" asChild className="mb-8">
            <Link href="/controles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Controles
            </Link>
        </Button>
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-primary">
                    Control del Partido
                </CardTitle>
                <div className="text-lg font-mono font-bold bg-accent text-accent-foreground px-4 py-2 rounded-md">
                    {match.status === 'LIVE' ? `${String(matchTime).padStart(2, '0')}:00` : match.status === 'SCHEDULED' ? '00:00' : 'Finalizado'}
                </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center justify-items-center gap-6 text-center py-8">
            {/* Team A */}
            <div className="flex flex-col items-center gap-4">
              <Image
                src={match.teamA.logoUrl || `https://avatar.vercel.sh/${match.teamA.name}.png`}
                alt={`Logo de ${match.teamA.name}`}
                width={96}
                height={96}
                className="rounded-full aspect-square object-contain"
              />
              <h2 className="text-xl font-bold">{match.teamA.name}</h2>
            </div>

            {/* Score Controls */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl font-bold tracking-tighter">
                {scoreA} - {scoreB}
              </span>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleScoreChange(setScoreA, -1)} disabled={match.status === 'FINISHED'}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input type="number" value={scoreA} onChange={(e) => setScoreA(parseInt(e.target.value))} className="w-16 text-center" disabled={match.status === 'FINISHED'} />
                    <Button variant="outline" size="icon" onClick={() => handleScoreChange(setScoreA, 1)} disabled={match.status === 'FINISHED'}>
                        <Plus className="h-4 w-4" />
                    </Button>
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleScoreChange(setScoreB, -1)} disabled={match.status === 'FINISHED'}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input type="number" value={scoreB} onChange={(e) => setScoreB(parseInt(e.target.value))} className="w-16 text-center" disabled={match.status === 'FINISHED'} />
                    <Button variant="outline" size="icon" onClick={() => handleScoreChange(setScoreB, 1)} disabled={match.status === 'FINISHED'}>
                        <Plus className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            </div>
            
            {/* Team B */}
            <div className="flex flex-col items-center gap-4">
              <Image
                src={match.teamB.logoUrl || `https://avatar.vercel.sh/${match.teamB.name}.png`}
                alt={`Logo de ${match.teamB.name}`}
                width={96}
                height={96}
                className="rounded-full aspect-square object-contain"
              />
              <h2 className="text-xl font-bold">{match.teamB.name}</h2>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-card-foreground/5 flex justify-end gap-2">
            {match.status === 'SCHEDULED' && <Button variant="accent">Iniciar Partido</Button>}
            {match.status === 'LIVE' && <Button variant="destructive">Finalizar Partido</Button>}
            {match.status === 'FINISHED' && <Button disabled>Partido Finalizado</Button>}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
