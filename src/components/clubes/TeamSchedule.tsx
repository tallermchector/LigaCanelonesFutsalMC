import type { FullMatch } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface TeamScheduleProps {
    matches: FullMatch[];
}

export function TeamSchedule({ matches }: TeamScheduleProps) {
    if (!matches.length) {
        return (
            <CardContent className="p-6 text-center text-muted-foreground">
                No hay partidos programados.
            </CardContent>
        );
    }
    
    return (
        <CardContent className="p-0">
            <div className="divide-y divide-border">
                {matches.map(match => (
                    <MatchItem key={match.id} match={match} />
                ))}
            </div>
        </CardContent>
    );
}

function MatchItem({ match }: { match: FullMatch }) {
    const { teamA, teamB, scoreA, scoreB, status, scheduledTime } = match;
    const date = new Date(scheduledTime);

    const renderScoreOrTime = () => {
        if (status === 'FINISHED') {
            return (
                <div className="text-center">
                    <p className="text-2xl font-bold">{scoreA} - {scoreB}</p>
                    <p className="text-xs text-red-500 font-semibold">FINAL</p>
                </div>
            );
        }
        if (status === 'LIVE') {
            return (
                <div className="text-center">
                    <p className="text-2xl font-bold animate-pulse">{scoreA} - {scoreB}</p>
                    <p className="text-xs text-green-500 font-semibold">EN VIVO</p>
                </div>
            );
        }
        return (
            <div className="text-center">
                <p className="text-lg font-bold">{date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs text-muted-foreground">hs.</p>
            </div>
        )
    }

    return (
         <div className="p-4 hover:bg-muted/50">
            <p className="text-xs text-center text-muted-foreground mb-2 font-semibold">
                {date.toLocaleDateString('es-UY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="grid grid-cols-3 items-center gap-4">
                <TeamDisplay team={teamA} />
                {renderScoreOrTime()}
                <TeamDisplay team={teamB} alignment="left" />
            </div>
            {(status === 'FINISHED' || status === 'LIVE') && (
                <div className="text-center mt-2">
                    <Link href={`/resumen/${match.id}`} className="text-sm font-semibold text-primary hover:underline">
                        Ver Resumen
                    </Link>
                </div>
            )}
        </div>
    )
}

function TeamDisplay({ team, alignment = "right" }: { team: FullMatch['teamA'], alignment?: "left" | "right" }) {
    return (
        <div className={`flex items-center gap-4 ${alignment === 'right' ? 'flex-row-reverse justify-end' : 'flex-row justify-start'}`}>
            <Image
                src={team.logoUrl || '/logofu.svg'}
                alt={`Logo de ${team.name}`}
                width={40}
                height={40}
                className="aspect-square object-contain"
            />
            <span className={`font-semibold text-sm md:text-base ${alignment === 'right' ? 'text-right' : 'text-left'}`}>{team.name}</span>
        </div>
    )
}