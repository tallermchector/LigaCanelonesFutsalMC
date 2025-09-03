
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


export function TacticalActions() {
  const { state, dispatch, handleSaveChanges } = useGame();
  const router = useRouter();

  const handlePeriodChange = (delta: number) => {
    const newPeriod = Math.max(1, state.period + delta);
    dispatch({ type: 'SET_PERIOD', payload: newPeriod });
  };
    
  const handleSaveAndExit = async () => {
    await handleSaveChanges();
    router.push('/controles');
  }

  return (
    <footer className="flex-shrink-0 border-t border-gray-700 bg-gray-800/50 p-2 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-5xl">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-row items-center justify-center gap-2">
                <Button
                    size="lg"
                    onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                    aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}
                    className={cn(
                        "w-32",
                        state.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                <Button variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} size="lg" className="text-white border-gray-600 hover:bg-gray-700 hover:text-white">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reiniciar
                </Button>
                 <div className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                    <div className="flex items-center gap-2 text-white">
                        <Flag className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                </div>
                 <Button variant="destructive" onClick={handleSaveAndExit} size="lg" className="w-32">
                    <Save className="mr-2 h-5 w-5" />
                    Guardar
                </Button>
            </div>

            {/* Mobile Layout */}
             <div className="md:hidden grid grid-cols-2 gap-2">
                 <Button
                    size="lg"
                    onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                    aria-label={state.isRunning ? "Pausar tiempo" : "Iniciar tiempo"}
                    className={cn(
                        "col-span-1",
                        state.isRunning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                    {state.isRunning ? 'Pausar' : 'Iniciar'}
                </Button>
                 <Button variant="destructive" onClick={handleSaveAndExit} size="lg" className="col-span-1">
                    <Save className="mr-2 h-5 w-5" />
                    Guardar
                </Button>
                 <div className="col-span-2 grid grid-cols-2 gap-2">
                    <div className="flex flex-1 items-center justify-around gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                        <div className="flex items-center gap-2 text-white">
                            <Flag className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}
