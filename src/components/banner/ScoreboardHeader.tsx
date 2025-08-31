
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
      <div className="relative p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Time and Period - Mobile */}
           <div className="flex md:hidden flex-col items-center justify-center order-2 w-full">
             <div className="text-5xl md:text-8xl font-black text-white">{`${score1} - ${score2}`}</div>
            <div className="mt-1 text-4xl md:text-5xl font-bold tracking-widest">{formatTime(timeLeft)}</div>
            <div className="mt-2 text-base md:text-xl font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              {period}
            </div>
          </div>
          
          {/* Team 1 Section */}
          <div className="flex items-center justify-between md:justify-start gap-2 md:gap-6 w-full md:w-1/3 order-1 md:order-1">
            <div className="flex items-center gap-2 md:gap-4">
                <Image
                src={team1Logo || `https://avatar.vercel.sh/${team1Name}.png`}
                alt={`${team1Name} logo`}
                width={80}
                height={80}
                className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white/10 p-1"
                />
                <div className="text-left">
                    <h1 className="text-xl md:text-4xl font-extrabold tracking-tight truncate w-32 md:w-64">{team1Name}</h1>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-6">
                <StatDisplay icon={<Shield className="w-5 h-5 md:w-8 md:h-8 text-yellow-400" />} value={fouls1} label="Faltas" />
                <StatDisplay icon={<Timer className="w-5 h-5 md:w-8 md:h-8 text-green-400" />} value={timeouts1} label="T. Muertos" />
            </div>
          </div>

          {/* Time and Score Section - Desktop */}
          <div className="text-center w-1/3 hidden md:block order-2">
            <div className="text-8xl font-black text-primary">{`${score1} - ${score2}`}</div>
            <div className="mt-2 text-5xl font-bold tracking-widest">{formatTime(timeLeft)}</div>
            <div className="mt-2 text-xl font-semibold uppercase tracking-wider bg-white/20 px-4 py-1 rounded-full inline-block">
              {period}
            </div>
          </div>

          {/* Team 2 Section */}
          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-6 w-full md:w-1/3 order-3 md:order-3">
             <div className="flex items-center gap-2 md:gap-6 text-right">
                <StatDisplay icon={<Shield className="w-5 h-5 md:w-8 md:h-8 text-yellow-400" />} value={fouls2} label="Faltas" />
                <StatDisplay icon={<Timer className="w-5 h-5 md:w-8 md:h-8 text-green-400" />} value={timeouts2} label="T. Muertos" />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="text-right">
                    <h1 className="text-xl md:text-4xl font-extrabold tracking-tight truncate w-32 md:w-64">{team2Name}</h1>
                </div>
                <Image
                src={team2Logo || `https://avatar.vercel.sh/${team2Name}.png`}
                alt={`${team2Name} logo`}
                width={80}
                height={80}
                className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-white/10 p-1"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
