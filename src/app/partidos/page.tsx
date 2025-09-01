
'use client';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, BarChart2, Tv } from 'lucide-react';
import type { FullMatch, MatchStatus } from '@/types';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function MatchCard({ match }: { match: FullMatch }) {
    const scheduledDateTime = new Date(match.scheduledTime);
    const formattedDate = scheduledDateTime.toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'long',
    });
    const formattedTime = scheduledDateTime.toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const getStatusInfo = () => {
        switch (match.status) {
            case 'LIVE':
                return { text: 'En Vivo', variant: 'destructive' as const, pulse: true };
            case 'FINISHED':
                return { text: 'Finalizado', variant: 'default' as const, pulse: false };
            case 'SCHEDULED':
            default:
                return { text: 'Programado', variant: 'secondary' as const, pulse: false };
        }
    };
    const statusInfo = getStatusInfo();

    return (
         <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20 bg-card">
            <CardHeader className="p-4 bg-card-foreground/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold truncate text-card-foreground">
                        {match.teamA.name} vs {match.teamB.name}
                    </CardTitle>
                     <Badge variant={statusInfo.variant} className={statusInfo.pulse ? 'animate-pulse' : ''}>
                        {statusInfo.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamA.logoUrl || ''}
                            alt={`Logo de ${match.teamA.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamA.name}</span>
                    </div>

                    {match.status !== 'SCHEDULED' ? (
                        <span className="text-2xl font-bold text-primary">{match.scoreA} - {match.scoreB}</span>
                    ) : (
                        <span className="text-xl font-bold text-muted-foreground">VS</span>
                    )}

                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamB.logoUrl || ''}
                            alt={`Logo de ${match.teamB.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamB.name}</span>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formattedTime} hs.</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 grid grid-cols-2 gap-2 bg-muted/50">
             {(match.status === 'FINISHED' || match.status === 'LIVE') && (
                <Button asChild size="sm" variant="outline">
                    <Link href={`/partidos/${match.id}/estadisticas`}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Estadísticas
                    </Link>
                </Button>
            )}
             {match.status === 'LIVE' && (
                <Button asChild size="sm" variant="destructive" className="text-white">
                     <Link href={`/partidos/${match.id}`}>
                        <Tv className="mr-2 h-4 w-4" />
                        Ver en Vivo
                    </Link>
                </Button>
             )}
            </CardFooter>
        </Card>
    );
}

function MatchList({ matches }: { matches: FullMatch[] }) {
    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}


export default function PartidosPage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatchesFromDb().then(data => {
        setAllMatches(data);
        setLoading(false);
    });
  }, []);

  const scheduled = allMatches.filter(m => m.status === 'SCHEDULED');
  const live = allMatches.filter(m => m.status === 'LIVE');
  const finished = allMatches.filter(m => m.status === 'FINISHED');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Calendario de Partidos"
          description="Consulta los próximos encuentros, los resultados de partidos finalizados y sigue la acción en vivo."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <Tabs defaultValue="live" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md">
                <TabsTrigger value="scheduled">Programados</TabsTrigger>
                <TabsTrigger value="live">En Vivo</TabsTrigger>
                <TabsTrigger value="finished">Finalizados</TabsTrigger>
            </TabsList>
            <TabsContent value="scheduled" className="mt-6">
                <MatchList matches={scheduled} />
            </TabsContent>
            <TabsContent value="live" className="mt-6">
                <MatchList matches={live} />
            </TabsContent>
            <TabsContent value="finished" className="mt-6">
                <MatchList matches={finished} />
            </TabsContent>
            </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
