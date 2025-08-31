
import { getMatchById } from '@/actions/match-actions';
import { ScoreboardHeader } from '@/components/banner/ScoreboardHeader';
import { Header } from '@/components/layout/header';
import type { MatchStatus } from '@/types';
import { notFound } from 'next/navigation';

interface MatchPageProps {
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

export default async function MatchPage({ params }: MatchPageProps) {
    const match = await getMatchById(params.id);

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
            </main>
        </div>
    );
}
