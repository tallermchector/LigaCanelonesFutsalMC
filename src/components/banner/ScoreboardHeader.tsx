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
  team1Logo,
  score1,
  team2Name,
  team2Logo,
  score2,
  timeLeft,
  period,
}) => {
  // Truncate team names for a cleaner look, like in broadcast graphics
  const team1Abbr = team1Name.substring(0, 3).toUpperCase();
  const team2Abbr = team2Name.substring(0, 3).toUpperCase();

  const getPeriodText = () => {
    if (period.includes('FINAL')) return 'FINAL';
    if (period.includes('PROGRAMADO')) return 'PROGRAMADO';
    if (period.includes('2')) return 'SEGUNDO TIEMPO';
    return 'PRIMER TIEMPO';
  };

  return (
    <div className="relative font-headline w-full max-w-2xl mx-auto flex flex-col items-center">
       <div className="z-10 mb-[-20px] bg-background p-1 rounded-full border-4 border-background">
        <FutsalBallIcon className="w-12 h-12" />
      </div>

      <div className="w-full text-white shadow-2xl rounded-lg overflow-hidden bg-accent flex items-center justify-between">
        
        {/* Team 1 */}
        <div className="flex items-center gap-4 p-3 bg-accent">
            <Image src={team1Logo} alt={`${team1Name} logo`} width={40} height={40} className="w-10 h-10 object-contain" />
            <h2 className="text-2xl font-extrabold tracking-wider">{team1Abbr}</h2>
        </div>
        
        {/* Score & Time */}
        <div className="flex-grow flex items-center justify-center h-16 bg-primary text-3xl font-black px-4 gap-4">
            <span>{score1}</span>
            <div className="flex flex-col items-center text-center">
                 <span className="text-base font-bold">{getPeriodText()}</span>
                 <span className="text-2xl font-orbitron">{formatTime(timeLeft)}</span>
            </div>
            <span>{score2}</span>
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-4 p-3 bg-accent">
            <h2 className="text-2xl font-extrabold tracking-wider">{team2Abbr}</h2>
             <Image src={team2Logo} alt={`${team2Name} logo`} width={40} height={40} className="w-10 h-10 object-contain" />
        </div>
      </div>
    </div>
  );
};
