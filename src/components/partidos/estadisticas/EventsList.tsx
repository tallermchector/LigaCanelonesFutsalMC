
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, RefreshCw, Shield, Square, Timer, Footprints, Target, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import type { GameEvent } from '@/types';
import { cn } from '@/lib/utils';
import { animationVariants } from '@/lib/animations';
import Image from 'next/image';
import { FutsalBallIcon } from '@/components/icons';

interface EventsListProps {
  events: GameEvent[];
  teamALogo: string;
  teamBLogo: string;
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
    <div className="flex w-full flex-col items-start">
      {events.map((event, index) => {
        const config = eventDisplayConfig[event.type];
        const isLastEvent = index === events.length - 1;
        const teamLogo = event.teamId === 'A' ? teamALogo : teamBLogo;
        const time = formatTimeFromTotalSeconds(event.timestamp);
        
        const renderEventContent = () => {
            if (event.type === 'SUBSTITUTION' && event.playerInName) {
                return (
                    <div className="flex flex-col gap-1 w-full text-sm">
                        <div className="flex items-center gap-2">
                           <ArrowRight className="w-4 h-4 shrink-0 text-red-400" />
                           <span className="truncate flex-1 text-white/80">{event.playerName} (Sale)</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <ArrowLeft className="w-4 h-4 shrink-0 text-green-400" />
                           <span className="truncate flex-1 text-white/80">{event.playerInName} (Entra)</span>
                        </div>
                    </div>
                )
            }
            if(!config) return null;
            return (
                <div className="w-full">
                    <p className="font-semibold text-sm md:text-base text-white truncate">{event.playerName}</p>
                    <p className={cn("text-xs md:text-sm flex items-center gap-1.5", config.className)}>
                      {config.icon}
                      <span>{config.label}</span>
                    </p>
                </div>
            )
        }

        return (
          <motion.div 
            key={event.id || index} 
            className="group flex gap-x-3 sm:gap-x-6 w-full"
            variants={animationVariants.slideInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
           >
            {/* Timeline Marker */}
            <div className="relative">
              {!isLastEvent && <div className="absolute left-1/2 top-10 h-full w-0.5 -translate-x-1/2 bg-white/10"></div>}
              <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-black/40 border border-white/10">
                <span className={cn("relative z-10 grid h-10 w-10 place-items-center rounded-full", config?.iconBg)}>
                  {config?.icon}
                </span>
              </div>
            </div>
            
            {/* Timeline Content */}
            <div className="-translate-y-1.5 pb-8 flex-1">
                 <Card className="flex-1 bg-black/40 backdrop-blur-sm border-white/10 p-3 shadow-md group-hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    {teamLogo && (
                      <Image src={teamLogo} alt={`${event.teamName} logo`} width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white/10 rounded-full p-1"/>
                    )}
                    <div className="flex-1 min-w-0">{renderEventContent()}</div>
                     <div className="font-mono text-xs sm:text-sm text-white/80 bg-black/50 px-2 py-1 rounded-md border border-white/10">
                        <span>{time.period}</span> {time.minute}
                    </div>
                  </div>
                </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
