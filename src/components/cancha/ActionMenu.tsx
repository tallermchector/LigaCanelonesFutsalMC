
'use client';

import * as React from "react";
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import type { GameEventType, Player } from '@/types';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActionMenuProps {
  player: Player;
  onAction: () => void;
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

export function ActionMenu({ player, onAction }: ActionMenuProps) {
  const { dispatch } = useGame();

  const handleActionClick = (type: GameEventType) => {
    if (type === 'SUBSTITUTION') {
        dispatch({ type: 'INITIATE_SUBSTITUTION' });
    } else {
        dispatch({ type: 'ADD_EVENT', payload: { type } });
    }
    onAction(); // Close the popover
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="p-2 border-b border-gray-600">
        <p className="font-bold text-white">{player.name}</p>
        <p className="text-xs text-gray-400"># {player.number}</p>
      </div>
      <div className="grid grid-cols-2 gap-1 p-1">
        {actionButtons.map(action => (
          <motion.div key={action.type} whileTap={{ scale: 0.95 }}>
            <Button
              variant={action.variant || 'ghost'}
              size="sm"
              className={cn("w-full justify-start text-white hover:text-white", action.className)}
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
