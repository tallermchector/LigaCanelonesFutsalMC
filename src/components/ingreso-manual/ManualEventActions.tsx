
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Goal, Shield, Square, Hand, Target, RefreshCw, Timer } from 'lucide-react';
import type { GameEvent, GameEventType, Player } from '@/types';
import { useGame } from '@/contexts/GameProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import * as React from 'react';

const actionButtons: { type: GameEventType; label: string; icon: React.ReactNode; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent" | null | undefined, className?: string }[] = [
  { type: 'GOAL', label: 'Gol', icon: <Goal />, variant: 'accent', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'ASSIST', label: 'Asistencia', icon: <Hand />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'SHOT', label: 'Tiro', icon: <Target />, variant: 'outline', className: 'border-gray-500 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white' },
  { type: 'FOUL', label: 'Falta', icon: <Shield />, variant: 'accent', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { type: 'YELLOW_CARD', label: 'Amarilla', icon: <Square />, variant: 'accent', className: 'bg-yellow-400 text-black hover:bg-yellow-500'},
  { type: 'RED_CARD', label: 'Roja', icon: <Square />, variant: 'destructive'},
  { type: 'SUBSTITUTION', label: 'Cambio', icon: <RefreshCw />, variant: 'accent', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { type: 'TIMEOUT', label: 'T. Muerto', icon: <Timer />, variant: 'accent', className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];


interface ManualEventActionsProps {
  player: Player;
  onAction: () => void;
}

export function ManualEventActions({ player, onAction }: ManualEventActionsProps) {
    const { state, dispatch, handleCreateGameEvent } = useGame();
    const { toast } = useToast();

    const handleActionClick = (type: GameEventType) => {
        const teamId = state.teamA?.players.some(p => p.id === player.id) ? state.teamA.id : state.teamB?.id;
        const teamName = state.teamA?.players.some(p => p.id === player.id) ? state.teamA.name : state.teamB?.name;
        
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
        handleCreateGameEvent(newEvent);
        toast({
          title: "Evento Registrado",
          description: `${type} para ${player.name}.`
        })
    
        onAction();
    };

    return (
        <Card>
            <CardContent className="p-4 flex flex-wrap justify-center items-center gap-4">
                 <div className="flex flex-col text-center">
                    <p className="font-bold text-lg">{player.name}</p>
                    <p className="text-sm text-muted-foreground"># {player.number}</p>
                </div>
                 <div className="h-10 border-r border-border mx-2"></div>
                {actionButtons.map(action => (
                <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
                    <Button
                    variant={action.variant || 'ghost'}
                    size="default"
                    className={cn("w-full justify-start", action.className)}
                    onClick={() => handleActionClick(action.type)}
                    >
                    {React.cloneElement(action.icon as React.ReactElement, { className: 'mr-2 h-4 w-4' })}
                    <span>{action.label}</span>
                    </Button>
                </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
