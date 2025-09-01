
'use client';

import { Shield, Timer } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

interface StatDisplayProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  className?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ icon, value, label, className }) => (
  <div className={cn("flex items-center gap-1 md:gap-2", className)}>
    {icon}
    <div className="text-left">
      <div className="text-lg md:text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/80 hidden md:block">{label}</div>
    </div>
  </div>
);

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
  return (
    <div className={cn("relative font-headline rounded-xl overflow-hidden bg-gray-900 text-white w-full max-w-6xl mx-auto shadow-2xl border-2 border-primary/50")}>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/banner_.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-red-900/50 opacity-50" />
      
      <div className="relative p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:items-center gap-4">

        {/* Team 1 Section */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Image
              src={team1Logo || `https://avatar.vercel.sh/${team1Name}.png`}
              alt={`${team1Name} logo`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 p-1"
            />
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight truncate">{team1Name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <StatDisplay icon={<Shield className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />} value={fouls1} label="Faltas" />
            <StatDisplay icon={<Timer className="w-5 h-5 md:w-7 md:h-7 text-green-400" />} value={timeouts1} label="T. Muertos" />
          </div>
        </div>

        {/* Center Section: Score, Time, Period */}
        <div className="text-center order-first md:order-none">
          <div className="text-5xl md:text-8xl font-black text-primary -my-2">{`${score1} - ${score2}`}</div>
          <div className="text-4xl md:text-5xl font-bold tracking-widest mt-2">{formatTime(timeLeft)}</div>
          <div className="text-base md:text-xl font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mt-2">
            {period}
          </div>
        </div>

        {/* Team 2 Section */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-4">
              <StatDisplay icon={<Shield className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />} value={fouls2} label="Faltas" />
              <StatDisplay icon={<Timer className="w-5 h-5 md:w-7 md:h-7 text-green-400" />} value={timeouts2} label="T. Muertos" />
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight truncate text-right">{team2Name}</h1>
            <Image
              src={team2Logo || `https://avatar.vercel.sh/${team2Name}.png`}
              alt={`${team2Name} logo`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 p-1"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
