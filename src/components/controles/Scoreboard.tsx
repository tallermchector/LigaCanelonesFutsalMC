
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Shield, Timer, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '../ui/label';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function Scoreboard() {
  const { state, dispatch } = useGame();
  const { teamA, teamB, scoreA, scoreB, time, period, foulsA, foulsB, timeoutsA, timeoutsB } = state;
  const [newMinutes, setNewMinutes] = useState(Math.floor(time / 60));
  const [newSeconds, setNewSeconds] = useState(time % 60);

  if (!teamA || !teamB) {
    return null; // Or a loading skeleton
  }

  const handleTimeChange = () => {
    const totalSeconds = (newMinutes * 60) + newSeconds;
    dispatch({ type: 'SET_TIME', payload: totalSeconds });
  };

  return (
    <Card className="w-full shadow-lg bg-card/80 backdrop-blur-sm border-primary/20">
      <CardContent className="p-2 sm:p-4">
        <div className="grid grid-cols-3 items-center text-center gap-1 sm:gap-2">
          {/* Team A Info */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={teamA.logoUrl || ''}
              alt={`Logo de ${teamA.name}`}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full aspect-square object-contain"
            />
            <h2 className="text-sm sm:text-lg font-bold text-card-foreground truncate w-24 sm:w-full">{teamA.name}</h2>
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> {foulsA}</div>
                <div className="hidden sm:flex items-center gap-1"><Timer className="h-4 w-4" /> T.M.: {timeoutsA}</div>
            </div>
          </div>

          {/* Center Score and Time */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className="text-4xl sm:text-6xl font-black tracking-tighter text-primary">
              {scoreA} - {scoreB}
            </div>
             <Dialog>
                <DialogTrigger asChild>
                    <div className="font-mono text-2xl sm:text-4xl font-bold bg-accent text-accent-foreground px-2 sm:px-4 py-1 rounded-md cursor-pointer hover:bg-accent/80 transition-colors">
                      {formatTime(time)}
                    </div>
                </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Editar Tiempo</DialogTitle>
                     </DialogHeader>
                     <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                            <Label htmlFor="minutes" className="text-right">Minutos</Label>
                            <Input
                                id="minutes"
                                type="number"
                                value={newMinutes}
                                onChange={(e) => setNewMinutes(Math.max(0, parseInt(e.target.value, 10)))}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                             <Label htmlFor="seconds" className="text-right">Segundos</Label>
                             <Input
                                id="seconds"
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
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Período: {period}</span>
            </div>
          </div>

          {/* Team B Info */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={teamB.logoUrl || ''}
              alt={`Logo de ${teamB.name}`}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full aspect-square object-contain"
            />
            <h2 className="text-sm sm:text-lg font-bold text-card-foreground truncate w-24 sm:w-full">{teamB.name}</h2>
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> {foulsB}</div>
                <div className="hidden sm:flex items-center gap-1"><Timer className="h-4 w-4" /> T.M.: {timeoutsB}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
