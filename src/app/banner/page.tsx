
'use client';

import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tv } from 'lucide-react';
import Image from 'next/image';
import { FullMatch } from '@/types';
import { useEffect, useState } from 'react';

export default function BannerSelectionPage() {
  const [liveMatches, setLiveMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      getAllMatchesFromDb().then(matches => {
          setLiveMatches(matches.filter(match => match.status === 'LIVE'));
          setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col p-4 py-8 md:p-8 pt-[var(--header-height)]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Partidos en Vivo</h1>
          <p className="mt-2 text-muted-foreground">Selecciona un partido para ver el marcador en vivo.</p>
        </div>

        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <Link href={`/banner/${match.id}`} key={match.id}>
                <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-card-foreground">
                            {match.teamA.name} vs {match.teamB.name}
                        </CardTitle>
                        <Badge variant="destructive" className="animate-pulse">
                            <Tv className="mr-2 h-4 w-4" />
                            EN VIVO
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-grow items-center justify-around p-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                       <Image
                            src={match.teamA.logoUrl || ''}
                            alt={`Logo de ${match.teamA.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                      <span className="font-semibold">{match.teamA.name}</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{match.scoreA} - {match.scoreB}</span>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Image
                            src={match.teamB.logoUrl || ''}
                            alt={`Logo de ${match.teamB.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                      <span className="font-semibold">{match.teamB.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
            <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en vivo en este momento.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Por favor, vuelve a intentarlo más tarde.</p>
          </div>
        )}
      </main>
    </div>
  );
}
