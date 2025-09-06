
'use client';

import type { GameEvent, Team } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hand, RefreshCw, Shield, Square, Timer, Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { FutsalBallIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type PlayByPlayFeedProps = {
  events: GameEvent[];
  teamA: Team;
  teamB: Team;
};

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
    let secondsLeft = totalSeconds;
    let period = 1;
    if (totalSeconds > gameDurationPerPeriod) {
        secondsLeft = totalSeconds - gameDurationPerPeriod;
        period = 2;
    }
    const minute = 20 - Math.floor(secondsLeft / 60) - 1;
    const second = 60 - (secondsLeft % 60);
    const displayMinute = minute + (period - 1) * 20;

    return { period: `${period}T`, minute: `${displayMinute}'` };
}

const PlayerLink = ({ id, name }: { id: number | null, name: string }) => {
    if (!id) return <span className="font-semibold text-sm md:text-base text-card-foreground truncate">{name}</span>;
    return (
        <Link href={`/jugadores/${id}`} className="font-semibold text-sm md:text-base text-card-foreground truncate hover:underline hover:text-primary transition-colors">
            {name}
        </Link>
    );
};

const EventCard = ({ event, team, isTeamA }: { event: GameEvent, team: Team, isTeamA: boolean }) => {
    const config = eventDisplayConfig[event.type];
    if (!config) return null;

    const renderEventContent = () => {
        if (event.type === 'SUBSTITUTION' && event.playerInName && event.playerInId) {
            return (
                <>
                    <p className="font-semibold text-sm md:text-base text-card-foreground truncate">{config.label}</p>
                    <div className="flex flex-col gap-1 w-full text-xs mt-1">
                        <div className="flex items-center gap-2 text-green-600">
                            <ArrowLeft className="w-3 h-3 shrink-0" />
                            <Link href={`/jugadores/${event.playerInId}`} className="truncate flex-1 hover:underline">{event.playerInName} (Entra)</Link>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                            <ArrowRight className="w-3 h-3 shrink-0" />
                            <Link href={`/jugadores/${event.playerId}`} className="truncate flex-1 hover:underline">{event.playerName} (Sale)</Link>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <PlayerLink id={event.playerId} name={event.playerName || team.name} />
                <p className={cn("text-xs md:text-sm text-muted-foreground", config.className)}>{config.label}</p>
            </>
        );
    };

    return (
        <div className={cn(
            "w-full bg-card border p-0 shadow-sm transition-colors",
            isTeamA ? 'border-primary/20 hover:border-primary/50' : 'border-accent/20 hover:border-accent/50'
        )}>
            <div className="flex items-center gap-3 p-3">
                 <div className={cn(
                    "flex-shrink-0 flex flex-col items-center",
                    isTeamA ? 'order-1' : 'order-3'
                 )}>
                    {team.logoUrl && (
                        <Image
                            src={team.logoUrl}
                            alt={`${team.name} logo`}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain bg-muted/50 rounded-full p-1"
                        />
                    )}
                 </div>
                <div className={cn("flex-1 min-w-0", isTeamA ? 'order-2 text-left' : 'order-2 text-right')}>
                    {renderEventContent()}
                </div>
            </div>
        </div>
    );
};


export function PlayByPlayFeed({ events, teamA, teamB }: PlayByPlayFeedProps) {

  if (!teamA || !teamB) return null;

  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Minuto a Minuto</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
            <div className="relative w-full">
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" aria-hidden="true"></div>
                <div className="relative flex flex-col items-center gap-y-6">
                    {sortedEvents.map((event, index) => {
                    const config = eventDisplayConfig[event.type];
                    if (!config) return null;

                    const team = event.teamId === teamA.id ? teamA : teamB;
                    const isTeamA = event.teamId === teamA.id;
                    const time = formatTimeFromTotalSeconds(event.timestamp);

                    return (
                        <motion.div 
                        key={event.id || index} 
                        className="relative z-10 w-full grid grid-cols-[1fr_auto_1fr] items-start gap-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div className={cn("pt-1 w-full", isTeamA ? 'col-start-1 text-right' : 'hidden')}>
                                {isTeamA && <EventCard event={event} team={team} isTeamA={isTeamA} />}
                            </div>
                            
                            <div className="col-start-2 flex flex-col items-center">
                                <div className="relative grid h-10 w-10 place-items-center">
                                    <div className={cn(
                                        "relative z-10 grid h-10 w-10 place-items-center rounded-full border bg-card",
                                        config.iconBg
                                    )}>
                                    {config.icon}
                                    </div>
                                </div>
                                <div className="mt-1.5 font-mono text-xs text-muted-foreground">
                                    <span>{time.minute}</span>
                                </div>
                            </div>

                            <div className={cn("pt-1 w-full", !isTeamA ? 'col-start-1 text-right' : 'col-start-3 text-left')}>
                                {!isTeamA && <EventCard event={event} team={team} isTeamA={isTeamA} />}
                            </div>
                        </motion.div>
                    );
                    })}
                    {sortedEvents.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                            No hay eventos registrados aún.
                        </p>
                    )}
                </div>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
