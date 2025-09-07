

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, CheckCircle, Minus, Plus, Timer, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { GameEvent } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '../ui/label';


const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function ControlsPanel() {
  const { state, dispatch, handleSaveChanges, createGameEvent } = useGame();
  const { toast } = useToast();
  const router = useRouter();
  const [newMinutes, setNewMinutes] = useState(Math.floor(state.time / 60));
  const [newSeconds, setNewSeconds] = useState(state.time % 60);

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };
  
  const handleTimeout = (teamId: 'A' | 'B') => {
      const team = teamId === 'A' ? state.teamA : state.teamB;
      if (!team) return;
      const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
          type: 'TIMEOUT',
          teamId: team.id,
          teamName: team.name,
          timestamp: state.time,
          playerId: null,
          playerName: null,
          playerInId: null,
          playerInName: null,
      }
      dispatch({ type: 'ADD_EVENT', payload: { event: newEvent }})
      createGameEvent(newEvent);
  }
  
  const handleSaveAndExit = async () => {
    await handleSaveChanges();
    router.push('/controles');
    router.refresh();
  }

  const handleTimeChange = () => {
    const totalSeconds = (newMinutes * 60) + newSeconds;
    dispatch({ type: 'SET_TIME', payload: totalSeconds });
  };

  return (
    <Card className="w-full shadow-md flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-center text-primary">Controles del Juego</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-around gap-4 pt-6 overflow-y-auto">
          <div className="text-center">
              <p className="text-sm text-muted-foreground">Tiempo de Juego</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <p className="text-6xl font-mono font-bold text-foreground cursor-pointer hover:text-primary transition-colors" aria-live="polite">{formatTime(state.time)}</p>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Tiempo</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div>
                                <Label htmlFor="minutes-panel" className="text-right">Minutos</Label>
                                <Input
                                    id="minutes-panel"
                                    type="number"
                                    value={newMinutes}
                                    onChange={(e) => setNewMinutes(Math.max(0, parseInt(e.target.value, 10)))}
                                    className="col-span-3"
                                />
                            </div>
                            <div>
                                <Label htmlFor="seconds-panel" className="text-right">Segundos</Label>
                                <Input
                                    id="seconds-panel"
                                    type="number"
                                    value={newSeconds}
                                    onChange={(e) => setNewSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" onClick={handleTimeChange}>Guardar Cambios</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
          </div>
          <div className="flex items-center gap-4">
              <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}>
                  {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                  {state.isRunning ? 'Pausar' : 'Iniciar'}
              </Button>
              <Button size="lg" variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} aria-label="Reiniciar tiempo">
                  <RotateCcw className="mr-2 h-5 w-5"/>
                  Reiniciar
              </Button>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período"><Minus className="h-4 w-4" /></Button>
              <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold text-lg">Período: {state.period}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex w-full justify-around pt-4 border-t">
              <div className="text-center">
                  <p className="text-sm font-semibold">{state.teamA?.name}</p>
                  <Button size="sm" variant="outline" className="mt-1" disabled={state.timeoutsA <= 0} onClick={() => handleTimeout('A')}>
                      <Timer className="mr-2 h-4 w-4" /> T. Muerto ({state.timeoutsA})
                  </Button>
              </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{state.teamB?.name}</p>
                    <Button size="sm" variant="outline" className="mt-1" disabled={state.timeoutsB <= 0} onClick={() => handleTimeout('B')}>
                      <Timer className="mr-2 h-4 w-4" /> T. Muerto ({state.timeoutsB})
                  </Button>
              </div>
          </div>
      </CardContent>
      <CardFooter className="p-4 bg-card-foreground/5 flex-shrink-0">
          <Button variant="destructive" onClick={handleSaveAndExit} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar y Salir
          </Button>
      </CardFooter>
    </Card>
  );
}
