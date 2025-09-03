'use client';

import type { GameEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Goal, Shield, Square, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type PlayByPlayFeedProps = {
  events: GameEvent[];
};

const EventIcon = ({ type }: { type: GameEvent['type'] }) => {
  switch (type) {
    case 'GOAL':
      return <Goal className="h-5 w-5 text-green-500" />;
    case 'YELLOW_CARD':
      return <Square className="h-5 w-5 text-yellow-400 fill-current" />;
    case 'RED_CARD':
      return <Square className="h-5 w-5 text-red-500 fill-current" />;
    case 'SUBSTITUTION':
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    case 'FOUL':
        return <Shield className="h-5 w-5 text-orange-500" />;
    default:
      return null;
  }
};

const getEventDescription = (event: GameEvent): string => {
    const minutes = Math.floor(event.timestamp / 60);
    const seconds = event.timestamp % 60;
    const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    switch (event.type) {
        case 'GOAL':
            return `¡Gol de ${event.playerName}! (${event.teamName}) - ${time}'`;
        case 'YELLOW_CARD':
            return `Tarjeta Amarilla para ${event.playerName} (${event.teamName}) - ${time}'`;
        case 'RED_CARD':
            return `Tarjeta Roja para ${event.playerName} (${event.teamName}) - ${time}'`;
        case 'SUBSTITUTION':
            return `Cambio en ${event.teamName}: Entra ${event.playerInName}, Sale ${event.playerName} - ${time}'`;
        case 'FOUL':
            return `Falta cometida por ${event.playerName} (${event.teamName}) - ${time}'`;
        default:
            return `Evento desconocido - ${time}'`;
    }
}

export function PlayByPlayFeed({ events }: PlayByPlayFeedProps) {
  // Sort events by timestamp descending (most recent first)
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Minuto a Minuto</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {sortedEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <EventIcon type={event.type} />
                  </div>
                  <p className={cn(
                      'text-sm font-medium',
                      event.type === 'GOAL' && 'font-bold text-green-600 dark:text-green-400',
                      event.type === 'RED_CARD' && 'font-bold text-red-600 dark:text-red-400'
                  )}>
                    {getEventDescription(event)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {sortedEvents.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                    No hay eventos registrados aún.
                </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
