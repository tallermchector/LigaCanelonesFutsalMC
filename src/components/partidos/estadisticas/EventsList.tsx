
import { Card, CardContent } from '@/components/ui/card';
import { FutsalBallIcon } from '@/components/icons';
import { Shield, Hand, Square } from 'lucide-react';
import type { GameEvent, GameEventType } from '@/types';
import { cn } from '@/lib/utils';

interface EventsListProps {
  events: GameEvent[];
}

const eventDisplayConfig: Record<GameEventType, { icon: React.ReactNode; label: string }> = {
    GOAL: { icon: <FutsalBallIcon className="w-5 h-5 text-primary" />, label: "Gol" },
    ASSIST: { icon: <Hand className="w-5 h-5 text-blue-500" />, label: "Asistencia" },
    FOUL: { icon: <Shield className="w-5 h-5 text-yellow-600" />, label: "Falta" },
    SHOT: { icon: <FutsalBallIcon className="w-5 h-5 text-gray-400" />, label: "Tiro" },
    YELLOW_CARD: { icon: <Square className="w-5 h-5 text-yellow-400 fill-current" />, label: "Tarjeta Amarilla" },
    RED_CARD: { icon: <Square className="w-5 h-5 text-red-500 fill-current" />, label: "Tarjeta Roja" },
    TIMEOUT: { icon: <Hand className="w-5 h-5 text-green-500" />, label: "Tiempo Muerto" },
};


const formatTimeFromTotalSeconds = (totalSeconds: number) => {
    // Futsal match is 20 min halves (1200s). We'll map the timestamp to this.
    const gameDurationPerPeriod = 1200; // 20 mins
    const period = totalSeconds > gameDurationPerPeriod ? 2 : 1;
    const timeInPeriod = totalSeconds > gameDurationPerPeriod ? totalSeconds - gameDurationPerPeriod : totalSeconds;
    const minute = Math.floor(timeInPeriod / 60);

    // This is a simplification. A real implementation would know the period.
    const displayMinute = period === 2 ? minute + 20 : minute;
    
    return `${displayMinute}'`;
}

export function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No se registraron eventos para este partido.
        </CardContent>
      </Card>
    );
  }

  const teamAId = events.find(e => e.teamId === 'A')?.teamId;
  const teamBId = events.find(e => e.teamId === 'B')?.teamId;

  const eventsByTeam = (teamId?: 'A' | 'B') => {
      if (!teamId) return [];
      return events.filter(e => e.teamId === teamId);
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>

          {events.map((event, index) => {
            const config = eventDisplayConfig[event.type];
            const isTeamA = event.teamId === teamAId;
            const alignmentClass = isTeamA ? 'justify-start' : 'justify-end text-right';
            const contentClass = isTeamA ? 'text-left pl-10' : 'text-right pr-10';
            const timeClass = isTeamA ? 'left-1/2 -translate-x-full pr-2' : 'left-1/2 translate-x-full pl-2';

            return (
              <div key={event.id || index} className={`relative flex w-full ${alignmentClass} my-4`}>
                <div className="w-[calc(50%-2.5rem)]">
                   <div className={`relative ${contentClass}`}>
                       <div className="flex items-center gap-3" style={{justifyContent: isTeamA ? 'flex-start' : 'flex-end'}}>
                           {isTeamA && config.icon}
                            <div>
                                <p className="font-semibold text-sm md:text-base">{event.playerName}</p>
                                <p className="text-xs text-muted-foreground">{event.teamName} - {config.label}</p>
                            </div>
                           {!isTeamA && config.icon}
                       </div>
                   </div>
                </div>
                
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-background"></div>
                </div>

                {/* Timestamp */}
                <div className={`absolute top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground ${timeClass}`}>
                    {formatTimeFromTotalSeconds(event.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
