
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag, Save, Minus, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


interface TacticalActionsProps {
  onTogglePanel: (panel: 'A' | 'B') => void;
  visiblePanel: 'A' | 'B' | null;
}


export function TacticalActions({ onTogglePanel, visiblePanel }: TacticalActionsProps) {
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
        <div className="mx-auto flex w-full max-w-5xl flex-row items-center justify-between gap-2">
            
            {/* Team A Panel Toggle */}
            <Button
                size="lg"
                variant={visiblePanel === 'A' ? 'default' : 'outline'}
                className="w-32 hidden md:flex"
                onClick={() => onTogglePanel('A')}
            >
                <Users className="mr-2 h-5 w-5"/> {state.teamA?.name.substring(0,3)}
            </Button>
            
            {/* Center Controls */}
            <div className="flex-grow flex justify-center">
                {/* Desktop Controls */}
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
                     <div className="flex items-center justify-center gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} aria-label="Disminuir período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Minus className="h-4 w-4" /></Button>
                        <div className="flex items-center gap-2 text-white px-2">
                            <Flag className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold whitespace-nowrap">P: {state.period}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} aria-label="Aumentar período" className="text-white h-8 w-8 hover:bg-gray-600/50 hover:text-white"><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="md:hidden w-full flex flex-col gap-2 items-center">
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                        <Button size="lg" onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} className={cn(state.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700')}>
                            {state.isRunning ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                            {state.isRunning ? 'Pausar' : 'Iniciar'}
                        </Button>
                        <Button variant="destructive" onClick={handleSaveAndExit} size="lg">
                            <Save className="mr-2 h-5 w-5" />
                            Guardar
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                        <div className="flex items-center justify-around gap-1 rounded-lg bg-gray-900/70 p-1 shadow-lg">
                            <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(-1)} className="text-white h-8 w-8 hover:bg-gray-600/50"><Minus className="h-4 w-4"/></Button>
                            <span className="font-semibold text-white">P: {state.period}</span>
                            <Button variant="ghost" size="icon" onClick={() => handlePeriodChange(1)} className="text-white h-8 w-8 hover:bg-gray-600/50"><Plus className="h-4 w-4"/></Button>
                        </div>
                         <Button variant="outline" onClick={() => dispatch({ type: 'RESET_TIMER' })} size="lg" className="text-white border-gray-600 hover:bg-gray-700">
                            <RotateCcw className="mr-2 h-5 w-5" />
                            Reiniciar
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                         <Button size="lg" variant={visiblePanel === 'A' ? 'default' : 'outline'} onClick={() => onTogglePanel('A')}>
                           <Users className="mr-2 h-5 w-5"/> {state.teamA?.name.substring(0,3)}
                        </Button>
                        <Button size="lg" variant={visiblePanel === 'B' ? 'default' : 'outline'} onClick={() => onTogglePanel('B')}>
                           <Users className="mr-2 h-5 w-5"/> {state.teamB?.name.substring(0,3)}
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Team B Panel Toggle and Save Button */}
            <div className="hidden md:flex items-center justify-end gap-2 w-32">
                <Button
                    size="lg"
                    variant={visiblePanel === 'B' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => onTogglePanel('B')}
                >
                    <Users className="mr-2 h-5 w-5"/> {state.teamB?.name.substring(0,3)}
                </Button>
            </div>
            <div className="hidden md:flex items-center justify-end gap-2 w-32">
                 <Button variant="destructive" onClick={handleSaveAndExit} size="lg" className="w-full">
                    <Save className="mr-2 h-5 w-5" />
                    Guardar
                </Button>
            </div>
        </div>
    </footer>
  );
}
