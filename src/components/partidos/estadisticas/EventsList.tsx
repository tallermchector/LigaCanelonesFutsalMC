
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FutsalBallIcon } from '@/components/icons';
import { Shield } from 'lucide-react';
import type { GameEvent } from '@/types';

interface EventsListProps {
  title: string;
  events: GameEvent[];
  eventType: 'GOAL' | 'FOUL';
}

const eventIconMap = {
  GOAL: <FutsalBallIcon className="w-5 h-5 text-primary" />,
  FOUL: <Shield className="w-5 h-5 text-yellow-500" />,
};

const formatTimeFromTotalSeconds = (totalSeconds: number) => {
    // Futsal match is 20 min halves (1200s). We'll map the timestamp to this.
    // This is a simplification. A real implementation would know the period.
    const gameDuration = 2400; // 40 mins total
    const percentOfGame = totalSeconds / gameDuration;
    const gameTimeSeconds = Math.floor(percentOfGame * 2400);
    const minute = Math.floor(gameTimeSeconds / 60);
    return `${minute}'`;
}

export function EventsList({ title, events, eventType }: EventsListProps) {
  const filteredEvents = events
    .filter((event) => event.type === eventType)
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredEvents.length > 0 ? (
          <ul className="space-y-4">
            {filteredEvents.map((event) => (
              <li key={event.id} className="flex items-center gap-4 text-sm">
                <div className="font-mono font-semibold w-8">{formatTimeFromTotalSeconds(event.timestamp)}</div>
                <div className="flex-shrink-0">{eventIconMap[eventType]}</div>
                <div className="flex-grow">
                  <p className="font-semibold">{event.playerName}</p>
                  <p className="text-xs text-muted-foreground">{event.teamName}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay eventos de este tipo.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
