
'use client';

import type { FullMatch } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, Clock, Tv } from 'lucide-react';

function MatchCard({ match }: { match: FullMatch }) {
    const scheduledDateTime = new Date(match.scheduledTime);
    const formattedDate = scheduledDateTime.toLocaleDateString('es-UY', {
        day: 'numeric',
        month: 'long',
    });
    const formattedTime = scheduledDateTime.toLocaleTimeString('es-UY', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const getStatusInfo = () => {
        switch (match.status) {
            case 'LIVE':
                return { text: 'En Vivo', variant: 'destructive' as const, pulse: true };
            case 'FINISHED':
                return { text: 'Finalizado', variant: 'default' as const, pulse: false };
            case 'SCHEDULED':
            default:
                return { text: 'Programado', variant: 'secondary' as const, pulse: false };
        }
    };
    const statusInfo = getStatusInfo();

    return (
         <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20 bg-card">
            <CardHeader className="p-4 bg-card-foreground/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold truncate text-card-foreground">
                        {`Jornada ${match.round}`}
                    </CardTitle>
                     <Badge variant={statusInfo.variant} className={statusInfo.pulse ? 'animate-pulse' : ''}>
                        {statusInfo.text}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
                <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamA.logoUrl || ''}
                            alt={`Logo de ${match.teamA.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamA.name}</span>
                    </div>

                    {match.status !== 'SCHEDULED' ? (
                        <span className="text-4xl font-black text-primary">{match.scoreA} - {match.scoreB}</span>
                    ) : (
                        <span className="text-2xl font-bold text-muted-foreground">VS</span>
                    )}

                    <div className="flex flex-col items-center gap-2 text-center w-24">
                        <Image
                            src={match.teamB.logoUrl || ''}
                            alt={`Logo de ${match.teamB.name}`}
                            width={64}
                            height={64}
                            className="rounded-full aspect-square object-contain"
                        />
                        <span className="font-semibold text-sm truncate w-full">{match.teamB.name}</span>
                    </div>
                </div>
                <div className="text-sm text-muted-foreground flex flex-col space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formattedTime} hs.</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-muted/50">
             {(match.status === 'FINISHED' || match.status === 'LIVE') && (
                <Button asChild size="sm" variant="outline">
                    <Link href={`/partidos/${match.id}/estadisticas`}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Estadísticas
                    </Link>
                </Button>
            )}
             {match.status === 'LIVE' && (
                <Button asChild size="sm" variant="destructive" className="text-white col-span-1 sm:col-span-1">
                     <Link href={`/partidos/${match.id}`}>
                        <Tv className="mr-2 h-4 w-4" />
                        Ver en Vivo
                    </Link>
                </Button>
             )}
              {match.status === 'FINISHED' && (
                 <div className="col-span-1 hidden sm:block"></div>
             )}
              {match.status === 'SCHEDULED' && (
                <div className="col-span-1 sm:col-span-2 h-9"></div> 
              )}
            </CardFooter>
        </Card>
    );
}

export default MatchCard;
