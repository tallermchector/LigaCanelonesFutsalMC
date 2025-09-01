
'use client';

import { getMatchByIdFromDb } from '@/actions/prisma-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import { Header } from '@/components/layout/header';
import type { FullMatch, MatchStatus } from '@/types';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveMatchState } from '@/hooks/useLiveMatchState';


function getPeriodLabel(status: MatchStatus, period: number | undefined): string {
    switch (status) {
        case 'FINISHED':
            return 'FINAL';
        case 'SCHEDULED':
            return 'PROGRAMADO';
        case 'LIVE':
            if (period === 2) return 'PERÍODO 2';
            return 'PERÍODO 1';
        default:
            return 'PERÍODO 1';
    }
}

function MatchPageSkeleton() {
    return (
        <div className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full text-center mb-8">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
            </div>
            <Skeleton className="h-48 w-full max-w-6xl" />
        </div>
    )
}

export default function MatchPage() {
    const params = useParams();
    const matchId = params.id as string;
    const [initialMatch, setInitialMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (matchId) {
            getMatchByIdFromDb(matchId).then(data => {
                if (data) {
                    setInitialMatch(data);
                }
                setLoading(false);
            });
        }
    }, [matchId]);

    const liveState = useLiveMatchState(matchId, initialMatch);

    if (loading) {
        return (
             <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex flex-1 flex-col pt-[var(--header-height)]">
                    <MatchPageSkeleton />
                </main>
            </div>
        )
    }

    if (!liveState) {
        notFound();
    }
    
    const {teamA, teamB, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, status} = liveState;

    if(!teamA || !teamB) {
        return (
             <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex flex-1 flex-col pt-[var(--header-height)]">
                    <MatchPageSkeleton />
                </main>
            </div>
        )
    }


    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8 pt-[var(--header-height)]">
                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Marcador en Vivo</h1>
                    <p className="text-muted-foreground mt-2">Sigue toda la acción del partido minuto a minuto.</p>
                </div>

                <ScoreboardHeader
                    team1Name={teamA.name}
                    team1Logo={teamA.logoUrl || ''}
                    score1={scoreA}
                    fouls1={foulsA} 
                    timeouts1={timeoutsA}
                    team2Name={teamB.name}
                    team2Logo={teamB.logoUrl || ''}
                    score2={scoreB}
                    fouls2={foulsB}
                    timeouts2={timeoutsB}
                    timeLeft={time}
                    period={getPeriodLabel(status, period)}
                />
                
                <div className="mt-8 text-center text-muted-foreground">
                    <p>La información del marcador se actualiza en tiempo real desde el panel de control.</p>
                </div>
                 <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SportsEvent',
                        'name': `Partido de Futsal: ${teamA.name} vs ${teamB.name}`,
                        'startDate': initialMatch?.scheduledTime,
                        'homeTeam': {
                            '@type': 'SportsTeam',
                            'name': teamA.name
                        },
                        'awayTeam': {
                            '@type': 'SportsTeam',
                            'name': teamB.name
                        },
                        'location': {
                            '@type': 'Place',
                            'name': 'Gimnasio Municipal de Canelones',
                            'address': 'Canelones, Uruguay'
                        },
                        'eventStatus': `https://schema.org/${status === 'LIVE' ? 'EventScheduled' : (status === 'FINISHED' ? 'EventCompleted' : 'EventScheduled')}`,
                        })
                    }}
                />
            </main>
        </div>
    );
}
