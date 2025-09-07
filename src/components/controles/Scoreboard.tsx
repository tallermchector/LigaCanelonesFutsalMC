
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
import { cn } from '@/lib/utils';

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

  const TeamScoreSection = ({ team, score, fouls, timeouts, alignment, bgColorClass }: { team: NonNullable<typeof teamA>, score: number, fouls: number, timeouts: number, alignment: 'left' | 'right', bgColorClass: string }) => (
      <div className={cn("flex items-center justify-center p-2 sm:p-4 rounded-lg", bgColorClass)}>
        <div className="flex items-center gap-2 sm:gap-4 w-full">
            <Image
                src={team.logoUrl || ''}
                alt={`Logo de ${team.name}`}
                width={64}
                height={64}
                className="w-10 h-10 sm:w-16 sm:h-16 rounded-full aspect-square object-contain bg-black/20 p-1"
            />
            <div className="flex-grow text-left overflow-hidden">
                <h2 className="text-sm sm:text-lg font-bold text-white truncate">{team.name}</h2>
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-white/80 mt-1">
                    <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> Faltas: {fouls}</div>
                    <div className="flex items-center gap-1"><Timer className="h-4 w-4" /> T.M: {timeouts}</div>
                </div>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white">{score}</div>
        </div>
      </div>
  );

  return (
    <div className="w-full shadow-lg bg-card/80 backdrop-blur-sm border-primary/20 rounded-lg">
      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch text-center gap-1 sm:gap-2">
          
          <TeamScoreSection 
            team={teamA}
            score={scoreA}
            fouls={foulsA}
            timeouts={timeoutsA}
            alignment="left"
            bgColorClass="bg-gradient-to-br from-blue-700 to-blue-900"
          />

          {/* Center Score and Time */}
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2">
            <div className="font-mono text-2xl sm:text-4xl font-bold bg-accent text-accent-foreground px-2 sm:px-4 py-1 rounded-md">
              <Dialog>
                  <DialogTrigger asChild>
                      <span className="cursor-pointer hover:bg-accent/80 transition-colors p-1 rounded">
                        {formatTime(time)}
                      </span>
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
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Período: {period}</span>
            </div>
          </div>

          <TeamScoreSection 
            team={teamB}
            score={scoreB}
            fouls={foulsB}
            timeouts={timeoutsB}
            alignment="right"
            bgColorClass="bg-gradient-to-bl from-red-700 to-red-900"
          />
        </div>
      </div>
    </div>
  );
}
