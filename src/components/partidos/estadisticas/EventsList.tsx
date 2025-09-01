
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FutsalBallIcon } from '@/components/icons';
import { Shield, Hand, Square } from 'lucide-react';
import type { GameEvent, GameEventType } from '@/types';
import { cn } from '@/lib/utils';
import { animationVariants } from '@/lib/animations';

interface EventsListProps {
  events: GameEvent[];
}

const eventDisplayConfig: Record<GameEventType, { icon: React.ReactNode; label: string; className: string }> = {
    GOAL: { icon: <FutsalBallIcon className="w-5 h-5" />, label: "Gol", className: "text-green-400" },
    ASSIST: { icon: <Hand className="w-5 h-5" />, label: "Asistencia", className: "text-blue-400" },
    FOUL: { icon: <Shield className="w-5 h-5" />, label: "Falta", className: "text-orange-400" },
    SHOT: { icon: <FutsalBallIcon className="w-5 h-5" />, label: "Tiro", className: "text-gray-400" },
    YELLOW_CARD: { icon: <Square className="w-5 h-5 fill-current" />, label: "Tarjeta Amarilla", className: "text-yellow-400" },
    RED_CARD: { icon: <Square className="w-5 h-5 fill-current" />, label: "Tarjeta Roja", className: "text-red-500" },
    TIMEOUT: { icon: <Hand className="w-5 h-5" />, label: "Tiempo Muerto", className: "text-teal-400" },
};


const formatTimeFromTotalSeconds = (totalSeconds: number) => {
    const gameDurationPerPeriod = 1200; // 20 mins
    const period = totalSeconds > gameDurationPerPeriod ? 2 : 1;
    const timeInPeriod = totalSeconds > gameDurationPerPeriod ? totalSeconds - gameDurationPerPeriod : totalSeconds;
    const minute = Math.floor(timeInPeriod / 60);

    return { period: `${period}T`, minute: `${minute}'` };
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardContent className="py-8 text-center text-white/70">
          No se registraron eventos para este partido.
        </CardContent>
      </Card>
    );
  }

  const teamAId = events.find(e => e.teamId === 'A')?.teamId;
  const teamBId = events.find(e => e.teamId === 'B')?.teamId;

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardContent className="p-4 md:p-6">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/20 -translate-x-1/2" aria-hidden="true"></div>

          <motion.div
             variants={animationVariants.staggerContainer}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.1 }}
          >
          {events.map((event, index) => {
            const config = eventDisplayConfig[event.type];
            const isTeamA = event.teamId === teamAId;
            
            const time = formatTimeFromTotalSeconds(event.timestamp);

            const itemVariants = {
                hidden: { opacity: 0, x: isTeamA ? -50 : 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            };

            return (
              <motion.div
                key={event.id || index} 
                className="relative flex items-center my-4"
                variants={itemVariants}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={cn("w-3 h-3 rounded-full border-2 border-background", isTeamA ? 'bg-red-600' : 'bg-blue-600' )}></div>
                </div>
                
                {isTeamA && (
                    <div className="w-[calc(50%-2.5rem)] pr-4">
                       <div className="text-right text-white">
                           <p className="font-semibold text-sm md:text-base">{event.playerName}</p>
                           <p className={cn("text-xs", config.className)}>{config.label}</p>
                       </div>
                    </div>
                )}
                
                <div className="w-20 text-center font-mono text-xs text-white/80">
                    <span>{time.period}</span> {time.minute}
                </div>

                {!isTeamA && (
                    <div className="w-[calc(50%-2.5rem)] pl-4">
                       <div className="text-left text-white">
                           <p className="font-semibold text-sm md:text-base">{event.playerName}</p>
                           <p className={cn("text-xs", config.className)}>{config.label}</p>
                       </div>
                    </div>
                )}
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
