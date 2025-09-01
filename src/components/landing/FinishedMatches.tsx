
'use client';

import { useState, useEffect } from 'react';
import { FinishedMatchCard } from './FinishedMatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { FullMatch } from '@/types';
import { getFinishedMatches } from '@/actions/match-actions';

function FinishedMatchesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
    )
}


export function FinishedMatches() {
    const [finishedMatches, setFinishedMatches] = useState<FullMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFinishedMatches().then(matches => {
            setFinishedMatches(matches);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
             <section id="results" className="py-20 text-center bg-secondary">
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

    // Show only the latest 6 matches
    const latestMatches = finishedMatches.slice(0, 6);

    return (
        <section id="results" className="py-20 text-center bg-secondary">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Resultados Recientes</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Revive los momentos de los últimos partidos finalizados.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latestMatches.map(match => (
                        <FinishedMatchCard key={match.id} match={match} />
                    ))}
                </div>
                {finishedMatches.length > 6 && (
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
