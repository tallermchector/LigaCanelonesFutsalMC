
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
          className="text-white border-gray-600 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:text-white/60" 
          disabled={timeouts <= 0} 
          onClick={() => handleTimeout(teamId)}
        >
            <Timer className="mr-1 md:mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline whitespace-nowrap">{team.name.substring(0,3)}.</span>
            <span className="sm:hidden">T.M.</span>
            <span className="hidden sm:inline ml-1 whitespace-nowrap">T. Muerto</span>
            <span className="ml-1">({timeouts})</span>
        </Button>
    )
  }

  return (
    <footer className="flex items-center justify-center p-1 md:p-2 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto gap-1">
            <div className="flex-1 flex justify-start">
              <TimeOutButton teamId="A" />
            </div>
            
            <div className="flex items-center justify-center gap-1 md:gap-2 bg-gray-900/70 p-1 md:p-2 rounded-lg md:rounded-xl shadow-lg">
                <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                <div className="flex items-center gap-1 md:gap-2 text-white text-xs md:text-base">
                    <Flag className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                
                <Button size="sm" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"} className={cn("w-20 md:w-24", state.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700")}>
                    {state.isRunning ? <Pause className="mr-1 md:mr-2 h-4 w-4"/> : <Play className="mr-1 md:mr-2 h-4 w-4"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} aria-label="Reiniciar tiempo" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white hidden sm:flex">
                    <RotateCcw className="mr-1 md:mr-2 h-4 w-4"/>
                    Reiniciar
                </Button>
                 <Button variant="destructive" onClick={handleSaveAndExit} size="sm">
                    <Save className="mr-1 md:mr-2 h-4 w-4" />
                    Guardar
                </Button>
            </div>
            
            <div className="flex-1 flex justify-end">
              <TimeOutButton teamId="B" />
            </div>
        </div>
    </footer>
  );
}
