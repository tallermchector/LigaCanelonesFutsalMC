
'use client';

import { getMatchById } from '@/actions/match-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import { Header } from '@/components/layout/header';
import type { FullMatch, MatchStatus } from '@/types';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


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
    const [match, setMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (matchId) {
            getMatchById(matchId).then(data => {
                if (data) {
                    setMatch(data);
                }
                setLoading(false);
            });
        }
    }, [matchId]);


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

    if (!match) {
        notFound();
    }
    
    // Simulate some live data for now
    const liveTime = match.status === 'LIVE' ? 1200 - ((new Date().getMinutes() * 60 + new Date().getSeconds()) % 1200) : 1200;
    const livePeriod = match.status === 'LIVE' ? (new Date().getMinutes() > 20 ? 2 : 1) : 1;


    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8 pt-[var(--header-height)]">
                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Marcador en Vivo</h1>
                    <p className="text-muted-foreground mt-2">Sigue toda la acción del partido minuto a minuto.</p>
                </div>

                <ScoreboardHeader
                    team1Name={match.teamA.name}
                    team1Logo={match.teamA.logoUrl || ''}
                    score1={match.scoreA}
                    fouls1={match.id.charCodeAt(match.id.length-1) % 6} 
                    timeouts1={match.id.charCodeAt(match.id.length-1) % 2}
                    team2Name={match.teamB.name}
                    team2Logo={match.teamB.logoUrl || ''}
                    score2={match.scoreB}
                    fouls2={(match.id.charCodeAt(match.id.length-1) + 1) % 6}
                    timeouts2={(match.id.charCodeAt(match.id.length-1) + 1) % 2}
                    timeLeft={liveTime}
                    period={getPeriodLabel(match.status, livePeriod)}
                />
                
                <div className="mt-8 text-center text-muted-foreground">
                    <p>Esta página se actualizará en tiempo real en futuras versiones.</p>
                </div>
                 <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SportsEvent',
                        'name': `Partido de Futsal: ${match.teamA.name} vs ${match.teamB.name}`,
                        'startDate': match.scheduledTime,
                        'homeTeam': {
                            '@type': 'SportsTeam',
                            'name': match.teamA.name
                        },
                        'awayTeam': {
                            '@type': 'SportsTeam',
                            'name': match.teamB.name
                        },
                        'location': {
                            '@type': 'Place',
                            'name': 'Gimnasio Municipal de Canelones',
                            'address': 'Canelones, Uruguay'
                        },
                        'eventStatus': `https://schema.org/${match.status === 'LIVE' ? 'EventScheduled' : (match.status === 'FINISHED' ? 'EventCompleted' : 'EventScheduled')}`,
                        })
                    }}
                />
            </main>
        </div>
    );
}
