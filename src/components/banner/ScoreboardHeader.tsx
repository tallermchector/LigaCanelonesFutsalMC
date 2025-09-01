
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

const StatDisplay = ({ label, value, icon, hasPenalty }: { label: string, value: number, icon: React.ReactNode, hasPenalty?: boolean }) => (
    <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-2">
            <div className={cn('h-6 w-6', hasPenalty ? 'text-destructive' : 'text-muted-foreground/80')}>{icon}</div>
            <span className={cn('text-xl font-bold', hasPenalty ? 'text-destructive' : 'text-foreground')}>
                {value}
            </span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
);


export const ScoreboardHeader: React.FC<ScoreboardHeaderProps> = ({
  team1Name,
  team1Logo,
  score1,
  fouls1,
  timeouts1,
  team2Name,
  team2Logo,
  score2,
  fouls2,
  timeouts2,
  timeLeft,
  period,
}) => {
  const team1Abbr = team1Name.substring(0, 3).toUpperCase();
  const team2Abbr = team2Name.substring(0, 3).toUpperCase();

  const getPeriodText = () => {
    if (period.includes('FINAL')) return 'FINAL';
    if (period.includes('PROGRAMADO')) return 'PROGRAMADO';
    if (period.includes('2')) return 'SEGUNDO TIEMPO';
    return 'PRIMER TIEMPO';
  };

  return (
    <div className="font-headline w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="relative z-10 mb-[-20px] bg-background p-1 rounded-full border-4 border-background shadow-md">
        <FutsalBallIcon className="w-10 h-10 md:w-12 md:h-12" />
      </div>

      <div className="w-full text-white shadow-2xl rounded-lg overflow-hidden flex items-stretch justify-between h-20 md:h-24">
        
        {/* Team 1 */}
        <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-navy-custom flex-1">
            <Image src={team1Logo} alt={`${team1Name} logo`} width={56} height={56} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
            <h2 className="text-lg md:text-2xl font-extrabold tracking-wider">{team1Abbr}</h2>
        </div>
        
        {/* Score & Time */}
        <div className="flex-grow flex items-center justify-center bg-primary text-xl md:text-3xl font-black px-2 md:px-4 gap-2 md:gap-4">
            <span className="text-2xl md:text-4xl">{score1}</span>
            <div className="flex flex-col items-center text-center leading-tight">
                 <span className="text-xs md:text-sm font-bold uppercase">{getPeriodText()}</span>
                 <span className="text-lg md:text-2xl font-bold font-orbitron">{formatTime(timeLeft)}</span>
            </div>
            <span className="text-2xl md:text-4xl">{score2}</span>
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-navy-custom flex-1 justify-end">
            <h2 className="text-lg md:text-2xl font-extrabold tracking-wider">{team2Abbr}</h2>
            <Image src={team2Logo} alt={`${team2Name} logo`} width={56} height={56} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="w-full grid grid-cols-2 gap-4 px-4 md:px-8 mt-4">
          {/* Team 1 Stats */}
          <div className="flex items-center justify-start gap-4 md:gap-8">
              <StatDisplay label="Faltas" value={fouls1} icon={<Shield />} hasPenalty={fouls1 >= 6} />
              <StatDisplay label="T.M." value={timeouts1} icon={<Timer className="text-green-500" />} />
          </div>
          {/* Team 2 Stats */}
          <div className="flex items-center justify-end gap-4 md:gap-8">
              <StatDisplay label="T.M." value={timeouts2} icon={<Timer className="text-green-500" />} />
              <StatDisplay label="Faltas" value={fouls2} icon={<Shield />} hasPenalty={fouls2 >= 6} />
          </div>
      </div>
    </div>
  );
};
