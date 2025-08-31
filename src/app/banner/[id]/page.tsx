
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getMatchById } from '@/actions/match-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import { Header } from '@/components/layout/header';
import type { FullMatch, GameState, MatchStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLiveMatchState } from '@/hooks/useLiveMatchState';

function getPeriodLabel(status: MatchStatus, period: number): string {
    switch (status) {
        case 'FINISHED':
            return 'FINAL';
        case 'SCHEDULED':
            return 'PROGRAMADO';
        case 'LIVE':
            if (period === 1) return 'PERÍODO 1';
            if (period === 2) return 'PERÍODO 2';
            return 'EN VIVO';
        default:
            return '';
    }
}

function BannerPageSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8">
                 <Skeleton className="h-12 w-64 mb-2" />
                 <Skeleton className="h-6 w-80 mb-8" />
                 <Skeleton className="h-[200px] w-full max-w-6xl" />
            </main>
        </div>
    )
}

export default function BannerPage() {
    const params = useParams();
    const matchId = params.id as string;
    
    const [initialMatch, setInitialMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (matchId) {
            getMatchById(matchId).then(data => {
                if (data) {
                    setInitialMatch(data);
                }
                setLoading(false);
            });
        }
    }, [matchId]);

    const liveState = useLiveMatchState(matchId, initialMatch);

    if (loading) {
        return <BannerPageSkeleton />;
    }

    if (!liveState) {
        notFound();
    }
    
    const {teamA, teamB, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time} = liveState;

    if(!teamA || !teamB) {
        return <BannerPageSkeleton />;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Marcador en Vivo</h1>
                    <p className="text-muted-foreground mt-2\">Sigue toda la acción del partido minuto a minuto.</p>
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
                    period={getPeriodLabel('LIVE', period)}
                />
            </main>
        </div>
    );
}
