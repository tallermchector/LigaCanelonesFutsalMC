
'use client';

import { FinishedMatchCard } from './FinishedMatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { FullMatch } from '@/types';

function FinishedMatchesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
    )
}

interface FinishedMatchesProps {
    finishedMatches: FullMatch[];
    loading: boolean;
}

export function FinishedMatches({ finishedMatches, loading }: FinishedMatchesProps) {

    if (loading) {
        return (
             <section id="results" className="py-20 text-center bg-secondary/50">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-primary mb-2">Resultados Recientes</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Revive los momentos de los últimos partidos finalizados.</p>
                    <FinishedMatchesSkeleton />
                </div>
            </section>
        );
    }


    if (finishedMatches.length === 0) {
        return null;
    }

    // Show only the latest 4 matches
    const latestMatches = finishedMatches.slice(0, 4);

    return (
        <section id="results" className="py-20 text-center bg-secondary/50">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Resultados Recientes</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Revive los momentos de los últimos partidos finalizados.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestMatches.map(match => (
                        <FinishedMatchCard key={match.id} match={match} />
                    ))}
                </div>
                {finishedMatches.length > 4 && (
                    <div className="mt-12">
                        <Button asChild variant="outline">
                            <Link href="/partidos">Ver todos los resultados</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
