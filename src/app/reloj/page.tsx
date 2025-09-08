
'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllMatches } from '@/actions/prisma-actions';
import type { FullMatch } from '@/types';
import { useLiveMatchState } from '@/hooks/useLiveMatchState';
import { Skeleton } from '@/components/ui/skeleton';

const formatTime = (seconds: number) => {
    const flooredSeconds = Math.floor(seconds);
    const minutes = Math.floor(flooredSeconds / 60);
    const remainingSeconds = flooredSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function MatchTimer({ match }: { match: FullMatch | null }) {
    const liveState = useLiveMatchState(match ? match.id : null, match);

    if (!liveState) {
        return <Skeleton className="h-16 w-48 bg-muted" />;
    }

    return (
        <div className="text-6xl font-mono font-bold text-foreground bg-card p-4 rounded-lg border">
            {formatTime(liveState.time)}
        </div>
    );
}

function AlternativeMatchTimer({ match }: { match: FullMatch | null }) {
    const [time, setTime] = useState(match?.time || 0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Cuando cambia el partido, reseteamos el tiempo.
        setTime(match?.time || 0);

        // Limpiamos el intervalo anterior si existe
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Si el partido está corriendo, iniciamos un nuevo intervalo
        if (match && match.isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    }
                    // Si el tiempo llega a 0, detenemos el intervalo.
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    return 0;
                });
            }, 1000);
        }

        // Función de limpieza para cuando el componente se desmonta o el partido cambia.
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [match]);
    
    if (!match) {
        return <Skeleton className="h-16 w-48 bg-muted" />;
    }
    
    return (
         <div className="text-6xl font-mono font-bold text-foreground bg-card p-4 rounded-lg border">
            {formatTime(time)}
        </div>
    )
}

function ClockDebugger() {
    const [liveMatches, setLiveMatches] = useState<FullMatch[]>([]);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllMatches().then(matches => {
            const live = matches.filter(m => m.status === 'LIVE');
            setLiveMatches(live);
            setLoading(false);
        });
    }, []);
    
    const selectedMatch = liveMatches.find(m => String(m.id) === selectedMatchId) || null;
    
    return (
         <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-center text-primary">Página de Depuración de Reloj</CardTitle>
                <CardDescription className="text-center">
                   Selecciona un partido para comparar implementaciones de cronómetro.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
                
                <div className="w-full max-w-sm">
                     <Select onValueChange={setSelectedMatchId} disabled={loading || liveMatches.length === 0}>
                        <SelectTrigger>
                            <SelectValue placeholder={loading ? "Cargando partidos..." : "Seleccione un partido en vivo"} />
                        </SelectTrigger>
                        <SelectContent>
                            {liveMatches.map(match => (
                                <SelectItem key={match.id} value={String(match.id)}>
                                    {match.teamA.name} vs {match.teamB.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     {liveMatches.length === 0 && !loading && <p className="text-sm text-muted-foreground text-center mt-2">No hay partidos en vivo.</p>}
                </div>

                {selectedMatch && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-semibold text-muted-foreground">Temporizador (useLiveMatchState)</h3>
                            <MatchTimer match={selectedMatch} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-semibold text-muted-foreground">Temporizador (useEffect local)</h3>
                            <AlternativeMatchTimer match={selectedMatch} />
                        </div>
                    </div>
                )}
               
            </CardContent>
        </Card>
    )
}

export default function ClockPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 py-8 md:p-8 pt-[var(--header-height)]">
                <ClockDebugger />
            </main>
            <Footer />
        </div>
    );
}
