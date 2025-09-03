'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, Minus, Plus, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


export function TacticalActions() {
  const { state, dispatch, handleSaveChanges } = useGame();
  const router = useRouter();

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };
  
  const handleTimeout = (teamId: 'A' | 'B') => {
      dispatch({ type: 'ADD_EVENT', payload: { type: 'TIMEOUT', teamId }})
  }
  
  const handleSaveAndExit = async () => {
    await handleSaveChanges();
    router.push('/cancha');
  }

  const TimeOutButton = ({teamId}: {teamId: 'A' | 'B'}) => {
    const team = teamId === 'A' ? state.teamA : state.teamB;
    const timeouts = teamId === 'A' ? state.timeoutsA : state.timeoutsB;

    if (!team) return null;
    
    return (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-white border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:text-white/60 flex-1 basis-1/2" 
          disabled={timeouts <= 0} 
          onClick={() => handleTimeout(teamId)}
        >
            <Timer className="mr-1 md:mr-2 h-4 w-4" /> 
            <span className="whitespace-nowrap">{team.name.substring(0,3)}.</span>
            <span className="ml-1">({timeouts})</span>
        </Button>
    )
  }

  return (
    <footer className="flex-shrink-0 border-t border-gray-700 bg-gray-800/50 p-2 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-5xl">
            {/* Main controls: Timer and Save */}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-900/70 p-2 shadow-lg">
                <Button
                    size="lg"
                    onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                    aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}
                    className={cn(
                        "flex-1 basis-1/2",
                        state.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                 <Button variant="destructive" onClick={handleSaveAndExit} size="lg" className="flex-1 basis-1/2">
                    <Save className="mr-2 h-5 w-5" />
                    Guardar
                </Button>
            </div>
            
            {/* Secondary controls: Period and Timeouts */}
            <div className="mt-2 flex items-stretch justify-center gap-2">
                <div className="flex flex-1 basis-1/2 items-center justify-around gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                    <div className="flex items-center gap-2 text-white">
                        <Flag className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-1 basis-1/2 items-stretch justify-center gap-2 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                  <TimeOutButton teamId="A" />
                  <TimeOutButton teamId="B" />
                </div>
            </div>
        </div>
    </footer>
  );
}
