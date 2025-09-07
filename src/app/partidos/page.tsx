
'use client';
import { getAllMatches } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MatchCard from '@/components/partidos/MatchCard';
import type { FullMatch, MatchStatus } from '@/types';
import { PageHero } from '@/components/layout/PageHero';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const RoundFilter = ({ rounds, selectedRound, onSelectRound }: { rounds: number[], selectedRound: number | 'all', onSelectRound: (round: number | 'all') => void }) => {
    if (rounds.length <= 1) return null;

    return (
        <Carousel
            opts={{ align: "start", containScroll: "trimSnaps" }}
            className="w-full max-w-lg mx-auto mb-8"
        >
            <CarouselContent className="-ml-2">
                 <CarouselItem className="pl-2 basis-auto">
                    <Button
                        variant={selectedRound === 'all' ? 'default' : 'outline'}
                        onClick={() => onSelectRound('all')}
                    >
                        Todas
                    </Button>
                </CarouselItem>
                {rounds.map(round => (
                    <CarouselItem key={round} className="pl-2 basis-auto">
                    <Button
                        variant={selectedRound === round ? 'default' : 'outline'}
                        onClick={() => onSelectRound(round)}
                        className="w-full"
                    >
                        Jornada {round}
                    </Button>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
      </Carousel>
    )
}

function MatchList({ matches, rounds, selectedRound, onSelectRound, showRoundFilter }: { matches: FullMatch[], rounds: number[], selectedRound: number | 'all', onSelectRound: (round: number | 'all') => void, showRoundFilter?: boolean }) {
    const filteredMatches = selectedRound === 'all' ? matches : matches.filter(m => m.round === selectedRound);

    if (matches.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">No hay partidos en este estado.</h3>
            </div>
        );
    }
    return (
        <>
            {showRoundFilter && <RoundFilter rounds={rounds} selectedRound={selectedRound} onSelectRound={onSelectRound} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </>
    );
}


export default function PartidosPage() {
  const [allMatches, setAllMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');

  useEffect(() => {
    getAllMatches().then(data => {
        setAllMatches(data);
        setLoading(false);
    });
  }, []);

  const scheduled = useMemo(() => allMatches.filter(m => m.status === 'SCHEDULED'), [allMatches]);
  const live = useMemo(() => allMatches.filter(m => m.status === 'LIVE'), [allMatches]);
  const finished = useMemo(() => allMatches.filter(m => m.status === 'FINISHED'), [allMatches]);
  
  const scheduledRounds = useMemo(() => {
    const rounds = new Set(scheduled.map(m => m.round).filter((r): r is number => r !== null));
    return Array.from(rounds).sort((a,b) => a - b);
  }, [scheduled]);

  const finishedRounds = useMemo(() => {
    const rounds = new Set(finished.map(m => m.round).filter((r): r is number => r !== null));
    return Array.from(rounds).sort((a,b) => a - b);
  }, [finished]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Calendario de Partidos"
          description="Consulta los próximos encuentros, los resultados de partidos finalizados y sigue la acción en vivo."
        />
        <div className="container mx-auto flex-1 p-4 py-8 md:p-8">
            <Tabs defaultValue="live" className="w-full" onValueChange={() => setSelectedRound('all')}>
            <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md">
                <TabsTrigger value="scheduled">Programados</TabsTrigger>
                <TabsTrigger value="live">En Vivo</TabsTrigger>
                <TabsTrigger value="finished">Finalizados</TabsTrigger>
            </TabsList>
            <TabsContent value="scheduled" className="mt-6">
                <MatchList 
                    matches={scheduled} 
                    rounds={scheduledRounds}
                    selectedRound={selectedRound}
                    onSelectRound={setSelectedRound}
                    showRoundFilter
                />
            </TabsContent>
            <TabsContent value="live" className="mt-6">
                <MatchList 
                    matches={live} 
                    rounds={[]}
                    selectedRound={selectedRound}
                    onSelectRound={setSelectedRound}
                />
            </TabsContent>
            <TabsContent value="finished" className="mt-6">
                <MatchList 
                    matches={finished} 
                    rounds={finishedRounds}
                    selectedRound={selectedRound}
                    onSelectRound={setSelectedRound}
                    showRoundFilter
                />
            </TabsContent>
            </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
