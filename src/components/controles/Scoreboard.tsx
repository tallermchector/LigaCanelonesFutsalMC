'use client';

import { useGame } from '@/contexts/GameProvider';
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
      <div className={cn(
          "flex-1 flex flex-col p-2 rounded-lg text-white",
          bgColorClass
      )}>
        <div className="flex items-center gap-2">
            <Image
                src={team.logoUrl || ''}
                alt={`Logo de ${team.name}`}
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full aspect-square object-contain bg-black/20 p-1"
            />
            <h2 className="text-base sm:text-lg font-bold uppercase truncate">{team.name}</h2>
        </div>
        <div className="flex-grow flex items-center justify-between mt-2">
             <div className="flex items-center gap-2 sm:gap-4 text-xs text-white/90">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4" /> {fouls}</div>
                <div className="flex items-center gap-1"><Timer className="h-4 w-4" /> {timeouts}</div>
            </div>
            <div className="text-4xl sm:text-5xl font-black">{score}</div>
        </div>
      </div>
  );

  return (
    <div className="w-full shadow-lg bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch text-center">
            
            <TeamScoreSection 
                team={teamA}
                score={scoreA}
                fouls={foulsA}
                timeouts={timeoutsA}
                alignment="left"
                bgColorClass="bg-gradient-to-br from-blue-800 to-blue-900/70"
            />

            {/* Center Score and Time */}
            <div className="flex flex-row sm:flex-col items-center justify-center gap-2 px-2 py-2 sm:py-4 bg-muted/30">
                <div className="font-mono text-3xl sm:text-4xl font-bold bg-accent text-accent-foreground px-3 py-1 rounded-md">
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
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    <span>P: {period}</span>
                </div>
            </div>

            <TeamScoreSection 
                team={teamB}
                score={scoreB}
                fouls={foulsB}
                timeouts={timeoutsB}
                alignment="right"
                bgColorClass="bg-gradient-to-bl from-red-800 to-red-900/70"
            />
        </div>
    </div>
  );
}
