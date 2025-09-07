'use client';

import * as React from "react";
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import type { GameEvent, GameEventType, Player } from '@/types';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ActionMenuProps {
  onActionComplete: () => void;
}

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent" | null | undefined, className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, variant: 'accent', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'SHOT', label: 'Tiro', icon: <Footprints />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, variant: 'accent', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square />, variant: 'accent', className: 'bg-yellow-400 text-black hover:bg-yellow-500'},
  { type: 'RED_CARD', label: 'Roja', icon: <Square />, variant: 'destructive'},
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, variant: 'accent', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
];

export function ActionMenu({ onActionComplete }: ActionMenuProps) {
  const { state, dispatch, createGameEvent } = useGame();
  const { toast } = useToast();
  const { selectedPlayer } = state;

  if (!selectedPlayer) return null;

  const team = selectedPlayer.teamId === 'A' ? state.teamA : state.teamB;
  const player = team?.players.find(p => p.id === selectedPlayer.playerId);

  if (!player) return null;

  const handleActionClick = (type: GameEventType) => {
    if (type === 'SUBSTITUTION') {
        dispatch({ type: 'INITIATE_SUBSTITUTION' });
    } else {
        const teamId = selectedPlayer.teamId === 'A' ? state.teamA?.id : state.teamB?.id;
        const teamName = selectedPlayer.teamId === 'A' ? state.teamA?.name : state.teamB?.name;
        
        if(!teamId || !teamName) return;

        const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
            type: type,
            teamId: teamId,
            playerId: player.id,
            playerName: player.name,
            teamName: teamName,
            timestamp: state.time,
            playerInId: null,
            playerInName: null,
        };
        dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
        createGameEvent(newEvent);
        toast({
          title: "Evento Registrado",
          description: `${type} para ${player.name}.`
        })
    }
    onActionComplete();
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="p-2 border-b">
        <p className="font-bold text-lg">{player.name}</p>
        <p className="text-sm text-muted-foreground"># {player.number}</p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        {actionButtons.map((action, index) => (
          <motion.div 
            key={action.type} 
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant={action.variant || 'ghost'}
              size="lg"
              className={cn("w-full justify-start", action.className)}
              onClick={() => handleActionClick(action.type)}
            >
              {React.cloneElement(action.icon as React.ReactElement, { className: 'mr-2 h-4 w-4' })}
              <span>{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
