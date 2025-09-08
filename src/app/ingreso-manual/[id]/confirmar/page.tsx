'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GameState, GameEvent, Team, FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreboardManual } from '@/components/ingreso-manual/ScoreboardManual';
import { GameProvider, useGame } from '@/contexts/GameProvider';
import { ArrowLeft, Save, CheckCircle, Shield, Hand, Footprints, Square, RefreshCw, Timer, Goal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMatchById } from '@/actions/prisma-actions';
import { saveMatchState } from '@/actions/match-actions';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const eventIcons: Record<GameEvent['type'], React.ReactNode> = {
    GOAL: <Goal className="h-4 w-4 text-green-500" />,
    ASSIST: <Hand className="h-4 w-4 text-blue-500" />,
    SHOT: <Footprints className="h-4 w-4 text-gray-500" />,
    FOUL: <Shield className="h-4 w-4 text-orange-500" />,
    YELLOW_CARD: <Square className="h-4 w-4 text-yellow-500 fill-current" />,
    RED_CARD: <Square className="h-4 w-4 text-red-500 fill-current" />,
    TIMEOUT: <Timer className="h-4 w-4 text-teal-500" />,
    SUBSTITUTION: <RefreshCw className="h-4 w-4 text-cyan-500" />,
    MATCH_START: <CheckCircle className="h-4 w-4 text-gray-500" />,
    PERIOD_START: <CheckCircle className="h-4 w-4 text-gray-500" />,
    MATCH_END: <CheckCircle className="h-4 w-4 text-gray-500" />,
};

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function ConfirmationContent() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const matchId = parseInt(params.id as string, 10);

    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isNaN(matchId)) {
            setLoading(false);
            return;
        }
        const savedStateJSON = localStorage.getItem(`futsal-match-state-${matchId}`);
        if (savedStateJSON) {
            setGameState(JSON.parse(savedStateJSON));
        }
        setLoading(false);
    }, [matchId]);

    const handleConfirmAndSave = async () => {
        if (!gameState) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se encontró el estado del partido.' });
            return;
        }
        setIsSaving(true);
        try {
            await saveMatchState(matchId, gameState);
            toast({
                title: '¡Partido Guardado!',
                description: 'Los datos del partido han sido guardados exitosamente en la base de datos.',
            });
            localStorage.removeItem(`futsal-match-state-${matchId}`);
            router.push('/ingreso-manual');
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error al Guardar',
                description: 'No se pudieron guardar los datos en la base de datos.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const teamAEvents = useMemo(() => {
        return gameState?.events.filter(e => e.teamId === gameState.teamA?.id) || [];
    }, [gameState]);

    const teamBEvents = useMemo(() => {
        return gameState?.events.filter(e => e.teamId === gameState.teamB?.id) || [];
    }, [gameState]);


    if (loading) {
        return <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
    }

    if (!gameState) {
        return <p className="text-center text-destructive">No se pudo cargar el estado del partido desde el almacenamiento local.</p>;
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">Confirmar Datos</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver y Seguir Editando
                </Button>
            </div>
            
            <GameProvider match={gameState as unknown as FullMatch}>
                <ScoreboardManual />
            </GameProvider>

            <Card>
                <CardHeader>
                    <CardTitle>Resumen de Eventos Registrados</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                             <Image src={gameState.teamA?.logoUrl || ''} alt={gameState.teamA?.name || ''} width={24} height={24} />
                            {gameState.teamA?.name}
                        </h3>
                        {teamAEvents.length > 0 ? (
                           teamAEvents.map(event => (
                            <div key={event.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                                {eventIcons[event.type]}
                                <span>{event.type} - {event.playerName} ({formatTime(event.timestamp)})</span>
                            </div>
                           ))
                        ) : <p className="text-xs text-muted-foreground">Sin eventos.</p>}
                    </div>
                     <div className="space-y-2">
                         <h3 className="font-semibold flex items-center gap-2">
                             <Image src={gameState.teamB?.logoUrl || ''} alt={gameState.teamB?.name || ''} width={24} height={24} />
                            {gameState.teamB?.name}
                        </h3>
                         {teamBEvents.length > 0 ? (
                           teamBEvents.map(event => (
                            <div key={event.id} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-md">
                                {eventIcons[event.type]}
                                <span>{event.type} - {event.playerName} ({formatTime(event.timestamp)})</span>
                            </div>
                           ))
                        ) : <p className="text-xs text-muted-foreground">Sin eventos.</p>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                 <Button size="lg" onClick={handleConfirmAndSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <ArrowLeft className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Confirmar y Guardar en la Base de Datos
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}


export default function ConfirmacionIngresoPage() {
    return (
         <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <ConfirmationContent />
                </div>
            </main>
            <Footer />
        </div>
    )
}
