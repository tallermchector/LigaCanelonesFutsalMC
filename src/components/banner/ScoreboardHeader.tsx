
'use client';

import { Shield, Timer } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { FutsalBallIcon } from '@/components/icons';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

interface ScoreboardHeaderProps {
  team1Name: string;
  team1Logo: string;
  score1: number;
  fouls1: number;
  timeouts1: number;
  team2Name: string;
  team2Logo: string;
  score2: number;
  fouls2: number;
  timeouts2: number;
  timeLeft: number;
  period: string;
}

export const ScoreboardHeader: React.FC<ScoreboardHeaderProps> = ({
  team1Name,
  score1,
  team2Name,
  score2,
  timeLeft,
  period,
}) => {
  // Truncate team names for a cleaner look, like in broadcast graphics
  const team1Abbr = team1Name.substring(0, 3).toUpperCase();
  const team2Abbr = team2Name.substring(0, 3).toUpperCase();

  return (
    <div className="relative font-headline w-full max-w-lg mx-auto flex flex-col items-center">
      {/* League Logo */}
      <div className="z-10 mb-[-20px]">
        <FutsalBallIcon className="w-16 h-16 bg-background p-2 rounded-full border-4 border-background" />
      </div>

      <div className="w-full text-white shadow-2xl rounded-lg overflow-hidden">
        {/* Main Score Bar */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-accent">
          {/* Team 1 */}
          <div className="flex items-center justify-end h-16 bg-accent p-4">
            <h2 className="text-3xl font-extrabold tracking-wider">{team1Abbr}</h2>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center h-16 bg-primary text-4xl font-black px-4">
            <span>{score1}</span>
            <span className="mx-2">-</span>
            <span>{score2}</span>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-start h-16 bg-accent p-4">
            <h2 className="text-3xl font-extrabold tracking-wider">{team2Abbr}</h2>
          </div>
        </div>

        {/* Time and Period Bar */}
        <div className="grid grid-cols-2 items-center bg-background/80 backdrop-blur-sm text-foreground">
           <div className="text-center p-2">
                <p className="text-sm text-muted-foreground uppercase tracking-widest">{period}</p>
           </div>
           <div className="text-center p-2">
            <span className="text-2xl font-bold font-orbitron">{formatTime(timeLeft)}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
