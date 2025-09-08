
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FullMatch } from '@/types';
import { getAllMatches } from '@/actions/prisma-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatchList } from '@/components/ingreso-manual/MatchList';
import { MatchSelectionSkeleton } from '@/components/ingreso-manual/MatchSelectionSkeleton';


export default function IngresoManualPage() {
  const [matches, setMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatches().then(data => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  const scheduled = matches.filter(m => m.status === 'SCHEDULED');
  const live = matches.filter(m => m.status === 'LIVE');
  const finished = matches.filter(m => m.status === 'FINISHED');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Ingreso Manual de Datos"
          description="Herramientas para el ingreso manual de datos de partidos."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <Card className="max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-primary" />
                        <span>Selección de Partido</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <MatchSelectionSkeleton />
                    ) : (
                        <Tabs defaultValue="finished" className="w-full">
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
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
