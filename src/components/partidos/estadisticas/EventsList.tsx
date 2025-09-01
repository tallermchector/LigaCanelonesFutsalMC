
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { GoalIcon } from '@/components/icons';
import { Shield, Hand, Square } from 'lucide-react';
import type { GameEvent, GameEventType } from '@/types';
import { cn } from '@/lib/utils';
import { animationVariants } from '@/lib/animations';
import Image from 'next/image';

interface EventsListProps {
  events: GameEvent[];
  teamALogo: string;
  teamBLogo: string;
}

const eventDisplayConfig: Record<GameEventType, { icon: React.ReactNode; label: string; className: string }> = {
    GOAL: { icon: <GoalIcon className="w-4 h-4 md:w-5 md:h-5" />, label: "Gol", className: "text-green-400 font-bold" },
    ASSIST: { icon: <Hand className="w-4 h-4 md:w-5 md:h-5" />, label: "Asistencia", className: "text-blue-400" },
    FOUL: { icon: <Shield className="w-4 h-4 md:w-5 md:h-5" />, label: "Falta", className: "text-orange-400" },
    SHOT: { icon: <GoalIcon className="w-4 h-4 md:w-5 md:h-5" />, label: "Tiro", className: "text-gray-400" },
    YELLOW_CARD: { icon: <Square className="w-4 h-4 md:w-5 md:h-5 fill-current" />, label: "Amarilla", className: "text-yellow-400" },
    RED_CARD: { icon: <Square className="w-4 h-4 md:w-5 md:h-5 fill-current" />, label: "Roja", className: "text-red-500 font-bold" },
    TIMEOUT: { icon: <Hand className="w-4 h-4 md:w-5 md:h-5" />, label: "T. Muerto", className: "text-teal-400" },
};


const formatTimeFromTotalSeconds = (totalSeconds: number) => {
    const gameDurationPerPeriod = 1200; // 20 mins
    const period = totalSeconds > gameDurationPerPeriod ? 2 : 1;
    const timeInPeriod = totalSeconds > gameDurationPerPeriod ? totalSeconds - gameDurationPerPeriod : totalSeconds;
    const minute = Math.floor(timeInPeriod / 60);

    return { period: `${period}T`, minute: `${minute}'` };
}

export function EventsList({ events, teamALogo, teamBLogo }: EventsListProps) {
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
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/20 -translate-x-1/2" aria-hidden="true"></div>

      <motion.div
          variants={animationVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4"
      >
      {events.map((event, index) => {
        const config = eventDisplayConfig[event.type];
        const isTeamA = event.teamId === 'A';
        const teamLogo = isTeamA ? teamALogo : teamBLogo;
        const time = formatTimeFromTotalSeconds(event.timestamp);

        const itemVariants = {
            hidden: { opacity: 0, x: isTeamA ? -30 : 30 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
        };

        return (
          <motion.div
            key={event.id || index} 
            className={cn("relative flex items-center w-full", isTeamA ? 'justify-start' : 'justify-end')}
            variants={itemVariants}
          >
            <div className={cn("w-[calc(50%-2rem)] flex items-center gap-2 sm:gap-3", isTeamA ? 'flex-row-reverse text-right' : 'flex-row text-left')}>
                {teamLogo && (
                  <Image src={teamLogo} alt={`${event.teamName} logo`} width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 object-contain bg-white/10 rounded-full p-1"/>
                )}
                <div className="flex-1">
                    <p className="font-semibold text-sm md:text-base text-white truncate">{event.playerName}</p>
                    <p className={cn("text-xs md:text-sm flex items-center gap-1.5", config.className, isTeamA ? 'justify-end flex-row-reverse' : 'justify-start')}>
                      {config.icon}
                      <span>{config.label}</span>
                    </p>
                </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-background p-1 rounded-full border-2 border-background">
                <div className="w-14 sm:w-16 text-center font-mono text-xs sm:text-sm text-white/80 bg-black/50 px-2 py-1 rounded-md border border-white/10">
                    <span>{time.period}</span> {time.minute}
                </div>
            </div>
          </motion.div>
        );
      })}
      </motion.div>
    </div>
  );
}
