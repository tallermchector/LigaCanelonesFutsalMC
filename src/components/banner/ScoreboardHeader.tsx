
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
  <div className={cn("flex items-center gap-1 md:gap-2 text-white", className)}>
    {icon}
    <div className="text-left">
      <div className="text-base md:text-xl font-bold">{value}</div>
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
    <div className={cn(
      "relative font-headline rounded-xl overflow-hidden w-full max-w-6xl mx-auto shadow-2xl border-2 border-primary/50",
      "bg-gradient-to-br from-gray-900 via-blue-900/50 to-red-900/50"
    )}>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/banner_.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative p-4 md:p-6 grid grid-cols-3 items-center gap-4 text-white">

        {/* Team 1 Section */}
        <div className="flex items-center justify-start gap-2 md:gap-4 col-span-1">
            <Image
              src={team1Logo || `https://avatar.vercel.sh/${team1Name}.png`}
              alt={`${team1Name} logo`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 p-1 object-contain"
            />
          <div className="flex flex-col items-start">
            <h2 className="text-lg md:text-3xl font-extrabold tracking-tight">{team1Name}</h2>
            <div className="hidden md:flex items-center gap-4 mt-1">
                <StatDisplay icon={<Shield className="w-4 h-4 text-yellow-400" />} value={fouls1} label="Faltas" />
                <StatDisplay icon={<Timer className="w-4 h-4 text-green-400" />} value={timeouts1} label="T. Muertos" />
            </div>
          </div>
        </div>

        {/* Center Section: Score, Time, Period */}
        <div className="text-center col-span-1">
          <div className="text-5xl md:text-8xl font-black text-white font-orbitron" style={{ textShadow: '0 0 15px hsla(var(--primary), 0.5)' }}>{`${score1} - ${score2}`}</div>
          <div className="text-4xl md:text-5xl font-bold tracking-widest mt-2 font-orbitron">{formatTime(timeLeft)}</div>
          <div className="text-base md:text-xl font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mt-3">
            {period}
          </div>
        </div>

        {/* Team 2 Section */}
        <div className="flex items-center justify-end gap-2 md:gap-4 col-span-1">
          <div className="flex flex-col items-end">
            <h2 className="text-lg md:text-3xl font-extrabold tracking-tight text-right">{team2Name}</h2>
            <div className="hidden md:flex items-center gap-4 mt-1">
              <StatDisplay icon={<Shield className="w-4 h-4 text-yellow-400" />} value={fouls2} label="Faltas" />
              <StatDisplay icon={<Timer className="w-4 h-4 text-green-400" />} value={timeouts2} label="T. Muertos" />
            </div>
          </div>
           <Image
              src={team2Logo || `https://avatar.vercel.sh/${team2Name}.png`}
              alt={`${team2Name} logo`}
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 p-1 object-contain"
            />
        </div>

      </div>
    </div>
  );
};
