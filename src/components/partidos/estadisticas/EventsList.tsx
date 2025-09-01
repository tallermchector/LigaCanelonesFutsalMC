
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, RefreshCw, Shield, Square, Timer, Footprints, Target, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import type { GameEvent, Team } from '@/types';
import { cn } from '@/lib/utils';
import { animationVariants } from '@/lib/animations';
import Image from 'next/image';
import { FutsalBallIcon } from '@/components/icons';

interface EventsListProps {
  events: GameEvent[];
  teamA: Team;
  teamB: Team;
}

const eventDisplayConfig: Record<string, { icon: React.ReactNode; label: string; className: string; iconBg: string }> = {
    GOAL: { icon: <FutsalBallIcon className="w-5 h-5" />, label: "Gol", className: "text-green-400 font-bold", iconBg: "bg-green-500/20" },
    ASSIST: { icon: <Hand className="w-5 h-5" />, label: "Asistencia", className: "text-blue-400", iconBg: "bg-blue-500/20" },
    FOUL: { icon: <Shield className="w-5 h-5" />, label: "Falta", className: "text-orange-400", iconBg: "bg-orange-500/20" },
    SHOT: { icon: <Target className="w-5 h-5" />, label: "Tiro", className: "text-gray-400", iconBg: "bg-gray-500/20" },
    YELLOW_CARD: { icon: <Square className="w-5 h-5 text-yellow-400 fill-current" />, label: "Amarilla", className: "text-yellow-400", iconBg: "bg-yellow-500/20" },
    RED_CARD: { icon: <Square className="w-5 h-5 text-red-500 fill-current" />, label: "Roja", className: "text-red-500 font-bold", iconBg: "bg-red-500/20" },
    TIMEOUT: { icon: <Timer className="w-5 h-5" />, label: "T. Muerto", className: "text-teal-400", iconBg: "bg-teal-500/20" },
    SUBSTITUTION: { icon: <RefreshCw className="w-5 h-5" />, label: "Cambio", className: "text-cyan-400", iconBg: "bg-cyan-500/20" },
};


const formatTimeFromTotalSeconds = (totalSeconds: number) => {
    const gameDurationPerPeriod = 1200; // 20 mins
    const period = totalSeconds > gameDurationPerPeriod ? 2 : 1;
    const timeInPeriod = totalSeconds > gameDurationPerPeriod ? totalSeconds - gameDurationPerPeriod : totalSeconds;
    const minute = Math.floor(timeInPeriod / 60);

    return { period: `${period}T`, minute: `${minute}'` };
}

const EventCard = ({ event, team, isTeamA }: { event: GameEvent, team: Team, isTeamA: boolean }) => {
    const config = eventDisplayConfig[event.type];
    if (!config) return null;

    const renderEventContent = () => {
        if (event.type === 'SUBSTITUTION' && event.playerInName) {
            return (
                <>
                    <p className="font-semibold text-sm md:text-base text-white truncate">{config.label}</p>
                    <div className="flex flex-col gap-1 w-full text-xs mt-1">
                        <div className="flex items-center gap-2 text-red-400">
                            <ArrowRight className="w-3 h-3 shrink-0" />
                            <span className="truncate flex-1">{event.playerName} (Sale)</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <ArrowLeft className="w-3 h-3 shrink-0" />
                            <span className="truncate flex-1">{event.playerInName} (Entra)</span>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <p className="font-semibold text-sm md:text-base text-white truncate">{event.playerName || team.name}</p>
                <p className={cn("text-xs md:text-sm", config.className)}>{config.label}</p>
            </>
        );
    };

    return (
        <Card className={cn(
            "w-full bg-black/40 backdrop-blur-sm border p-0 shadow-md transition-colors",
            isTeamA ? 'border-primary/50 hover:border-primary' : 'border-accent/50 hover:border-accent'
        )}>
            <CardContent className="flex items-center gap-3 p-3">
                {team.logoUrl && (
                    <Image
                        src={team.logoUrl}
                        alt={`${team.name} logo`}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain bg-white/10 rounded-full p-1"
                    />
                )}
                <div className="flex-1 min-w-0 text-left">
                    {renderEventContent()}
                </div>
            </CardContent>
        </Card>
    );
};


export function EventsList({ events, teamA, teamB }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardContent className="py-8 text-center text-white/70">
          No se registraron eventos para este partido.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Central timeline bar */}
      <div className="absolute left-5 top-0 h-full w-0.5 -translate-x-1/2 bg-white/10" aria-hidden="true"></div>

      <div className="relative flex flex-col items-start gap-y-6">
        {events.map((event, index) => {
          const config = eventDisplayConfig[event.type];
          if (!config) return null;

          const team = event.teamId === 'A' ? teamA : teamB;
          const isTeamA = event.teamId === 'A';
          const time = formatTimeFromTotalSeconds(event.timestamp);

          return (
            <motion.div 
              key={event.id || index} 
              className="relative z-10 w-full flex items-start gap-x-4 pl-10"
              variants={animationVariants.slideInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
             >
                <div className="absolute top-0 left-0 flex flex-col items-center">
                    <div className="relative grid h-10 w-10 place-items-center">
                        <div className={cn(
                            "relative z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white",
                            config.iconBg
                        )}>
                        {config.icon}
                        </div>
                    </div>
                     <div className="mt-1.5 font-mono text-xs text-white/80">
                       <span>{time.period}</span> {time.minute}
                   </div>
                </div>
                
                <div className="pt-1 w-full">
                     <EventCard event={event} team={team} isTeamA={isTeamA} />
                </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
