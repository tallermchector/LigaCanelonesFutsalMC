'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, CheckCircle } from 'lucide-react';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

export function ControlsPanel() {
  const { state, dispatch } = useGame();

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };

  return (
    <Card className="w-full max-w-sm shadow-md flex flex-col">
      <CardHeader>
        <CardTitle className="text-center text-primary">Controles del Juego</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-6">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Tiempo de Juego</p>
            <p className="text-6xl font-mono font-bold text-foreground">{formatTime(state.time)}</p>
        </div>
        <div className="flex items-center gap-4">
            <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}>
                {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                {state.isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })}>
                <RotateCcw className="mr-2 h-5 w-5"/>
                Reiniciar
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => handlePeriodChange(-1)}>&lt;</Button>
            <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Período: {state.period}</span>
            </div>
            <Button variant="ghost" onClick={() => handlePeriodChange(1)}>&gt;</Button>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4 p-4 bg-card-foreground/5">
        <Button variant="accent" onClick={() => console.log('Guardando cambios...', state)}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
        </Button>
        <Button variant="destructive" onClick={() => console.log('Finalizando partido...')}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Partido
        </Button>
      </CardFooter>
    </Card>
  );
}
