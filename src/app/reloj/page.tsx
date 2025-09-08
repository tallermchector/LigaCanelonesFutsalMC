
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
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';

const formatTime = (seconds: number) => {
    const flooredSeconds = Math.floor(seconds);
    const minutes = Math.floor(flooredSeconds / 60);
    const remainingSeconds = flooredSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function MatchTimer({ time }: { time: number | null }) {
    if (time === null) {
        return <Skeleton className="h-16 w-48 bg-muted" />;
    }

    return (
        <div className="text-6xl font-mono font-bold text-foreground bg-card p-4 rounded-lg border">
            {formatTime(time)}
        </div>
    );
}

function TimeDifferenceDisplay({ time1, time2 }: { time1: number | null, time2: number | null }) {
    if (time1 === null || time2 === null) {
        return null;
    }
    const difference = Math.abs(time1 - time2);
    const isDifferent = difference > 0.1; // Use a small threshold to avoid floating point issues

    return (
        <Card className={cn(
            "w-full max-w-sm mt-6 border-2 transition-colors",
            isDifferent ? "border-destructive bg-destructive/10" : "border-green-500/50 bg-green-500/10"
        )}>
            <CardHeader className="pb-2">
                 <CardTitle className={cn(
                    "text-center text-lg flex items-center justify-center gap-2",
                     isDifferent ? "text-destructive" : "text-green-500"
                 )}>
                    <Timer className="h-5 w-5" />
                    Diferencia de Tiempo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-4xl font-mono font-bold">
                    {difference.toFixed(2)}s
                </p>
            </CardContent>
        </Card>
    );
}

function ClockDebugger() {
    const [liveMatches, setLiveMatches] = useState<FullMatch[]>([]);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const selectedMatch = liveMatches.find(m => String(m.id) === selectedMatchId) || null;
    
    // Logic for the first timer (using the main hook)
    const liveState = useLiveMatchState(selectedMatch ? selectedMatch.id : null, selectedMatch);
    const hookTime = liveState?.time ?? null;

    // Logic for the second, alternative timer
    const [alternativeTime, setAlternativeTime] = useState<number | null>(null);
    const lastTickRef = useRef<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // Effect to get live matches
    useEffect(() => {
        getAllMatches().then(matches => {
            const live = matches.filter(m => m.status === 'LIVE');
            setLiveMatches(live);
            setLoading(false);
        });
    }, []);

    // Effect to manage the alternative timer with high-precision calculation
    useEffect(() => {
        // Set the initial time when a match is selected
        if (selectedMatch) {
          setAlternativeTime(selectedMatch.time);
        } else {
          setAlternativeTime(null);
        }

        // Clear any existing interval when the selected match changes
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            lastTickRef.current = null;
        }

        // Start a new interval if a match is selected and is running
        if (selectedMatch && selectedMatch.isRunning) {
            lastTickRef.current = Date.now();
            intervalRef.current = setInterval(() => {
                setAlternativeTime(prevTime => {
                    if (prevTime === null || prevTime <= 0 || !lastTickRef.current) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return 0;
                    }
                    const now = Date.now();
                    const timePassed = (now - lastTickRef.current) / 1000;
                    lastTickRef.current = now;

                    const newTime = Math.max(0, prevTime - timePassed);
                    if (newTime <= 0 && intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    return newTime;
                });
            }, 100); // Check more frequently for better precision display
        }

        // Cleanup function to clear interval on unmount or re-render
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedMatch]);
    
    return (
         <Card className="w-full max-w-4xl">
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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="font-semibold text-muted-foreground">Temporizador (useLiveMatchState)</h3>
                                <MatchTimer time={hookTime} />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="font-semibold text-muted-foreground">Temporizador (useEffect local)</h3>
                                <MatchTimer time={alternativeTime} />
                            </div>
                        </div>
                        <TimeDifferenceDisplay time1={hookTime} time2={alternativeTime} />
                    </>
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
