
import { getMatchById } from '@/actions/match-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import { Header } from '@/components/layout/header';
import type { FullMatch, MatchStatus } from '@/types';
import { notFound } from 'next/navigation';

interface BannerPageProps {
    params: {
        id: string;
    }
}

function getPeriodLabel(status: MatchStatus, period: number | undefined): string {
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

export default async function BannerPage({ params }: BannerPageProps) {
    const match = await getMatchById(params.id);

    if (!match) {
        notFound();
    }
    
    // Simulate some live data for now
    const liveTime = match.status === 'LIVE' ? Math.floor(Math.random() * 1200) : 1200;
    const livePeriod = match.status === 'LIVE' ? (Math.random() > 0.5 ? 2 : 1) : 1;


    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Marcador en Vivo</h1>
                    <p className="text-muted-foreground mt-2">Sigue toda la acción del partido minuto a minuto.</p>
                </div>

                <ScoreboardHeader
                    team1Name={match.teamA.name}
                    team1Logo={match.teamA.logoUrl || ''}
                    score1={match.scoreA}
                    fouls1={Math.floor(Math.random() * 6)} 
                    timeouts1={Math.random() > 0.5 ? 0 : 1}
                    team2Name={match.teamB.name}
                    team2Logo={match.teamB.logoUrl || ''}
                    score2={match.scoreB}
                    fouls2={Math.floor(Math.random() * 6)}
                    timeouts2={Math.random() > 0.5 ? 0 : 1}
                    timeLeft={liveTime}
                    period={getPeriodLabel(match.status, livePeriod)}
                />
                
                <div className="mt-8 text-center text-muted-foreground">
                    <p>Esta página se actualizará en tiempo real en futuras versiones.</p>
                </div>
            </main>
        </div>
    );
}

