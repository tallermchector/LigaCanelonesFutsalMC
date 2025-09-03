
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, CheckCircle, Minus, Plus, Timer, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function TacticalActions() {
  const { state, dispatch, handleSaveChanges } = useGame();
  const { toast } = useToast();
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

  return (
    <footer className="flex items-center justify-center p-2 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            {/* Team A Timeout */}
            <Button size="sm" variant="outline" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white" disabled={state.timeoutsA <= 0} onClick={() => handleTimeout('A')}>
                <Timer className="mr-2 h-4 w-4" /> {state.teamA?.name.substring(0,3)} T. Muerto ({state.timeoutsA})
            </Button>
            
            {/* Main Controls */}
            <div className="flex items-center gap-2 bg-gray-900/70 p-2 rounded-xl shadow-lg">
                <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                <div className="flex items-center gap-2 text-white">
                    <Flag className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-lg">Período: {state.period}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                
                <Button size="sm" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"} className="w-24 bg-blue-600 hover:bg-blue-700">
                    {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} aria-label="Reiniciar tiempo" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white">
                    <RotateCcw className="mr-2 h-5 w-5"/>
                    Reiniciar
                </Button>
                 <Button variant="destructive" onClick={handleSaveAndExit} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                </Button>
            </div>

             {/* Team B Timeout */}
            <Button size="sm" variant="outline" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white" disabled={state.timeoutsB <= 0} onClick={() => handleTimeout('B')}>
                <Timer className="mr-2 h-4 w-4" /> {state.teamB?.name.substring(0,3)} T. Muerto ({state.timeoutsB})
            </Button>
        </div>
    </footer>
  );
}
