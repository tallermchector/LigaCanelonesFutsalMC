'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw } from 'lucide-react';
import type { GameEventType } from '@/types';
import { motion } from 'framer-motion';

export function EventButtons() {
  const { state, dispatch } = useGame();
  const { selectedPlayer, teamA, teamB } = state;

  const handleAddEvent = (type: GameEventType) => {
    dispatch({ type: 'ADD_EVENT', payload: { type } });
  };
  
  const getPlayerInfo = () => {
    if (!selectedPlayer) return null;
    const team = selectedPlayer.teamId === 'A' ? teamA : teamB;
    const player = team?.players?.find(p => p.id === selectedPlayer.playerId);
    return player ? `${player.name} (#${player.number})` : null;
  }

  const selectedPlayerInfo = getPlayerInfo();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg text-primary">Registrar Evento</CardTitle>
        <CardDescription className="h-5">
            {selectedPlayerInfo ? `Para: ${selectedPlayerInfo}` : 'Seleccione un jugador'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center flex-wrap gap-3 pt-4">
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <Button 
                onClick={() => handleAddEvent('GOAL')} 
                disabled={!selectedPlayer}
                aria-label="Registrar gol"
            >
              <Goal className="mr-2 h-4 w-4" />
              Gol
            </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <Button 
                onClick={() => handleAddEvent('ASSIST')} 
                disabled={!selectedPlayer}
                aria-label="Registrar asistencia"
                variant="outline"
            >
              <Hand className="mr-2 h-4 w-4" />
              Asistencia
            </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
         <Button 
            onClick={() => handleAddEvent('SHOT')} 
            disabled={!selectedPlayer}
            aria-label="Registrar tiro al arco"
            variant="outline"
        >
          <Footprints className="mr-2 h-4 w-4" />
          Tiro al arco
        </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
        <Button 
            onClick={() => handleAddEvent('FOUL')} 
            disabled={!selectedPlayer}
            aria-label="Registrar falta"
            variant="destructive"
            className="bg-orange-500 hover:bg-orange-600"
        >
          <Shield className="mr-2 h-4 w-4" />
          Falta
        </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
        <Button
            onClick={() => handleAddEvent('YELLOW_CARD')}
            disabled={!selectedPlayer}
            aria-label="Registrar tarjeta amarilla"
            className="bg-yellow-400 text-black hover:bg-yellow-500"
        >
            <Square className="mr-2 h-4 w-4 fill-current" />
            Amarilla
        </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
        <Button
            onClick={() => handleAddEvent('RED_CARD')}
            disabled={!selectedPlayer}
            aria-label="Registrar tarjeta roja"
            variant="destructive"
        >
            <Square className="mr-2 h-4 w-4 fill-current" />
            Roja
        </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <Button
                onClick={() => handleAddEvent('SUBSTITUTION')}
                disabled={!selectedPlayer}
                aria-label="Registrar cambio"
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Cambio
            </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
