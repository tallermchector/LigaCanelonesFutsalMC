

'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Shield, Hand, Footprints, Square, RefreshCw, XCircle } from 'lucide-react';
import type { GameEvent, GameEventType } from '@/types';
import { motion } from 'framer-motion';

export function EventButtons() {
  const { state, dispatch, createGameEvent } = useGame();
  const { selectedPlayer, teamA, teamB, substitutionState } = state;

  const handleAddEvent = (type: GameEventType) => {
    if (type === 'SUBSTITUTION') {
      dispatch({ type: 'INITIATE_SUBSTITUTION' });
      return;
    }
    
    if (!selectedPlayer) return;

    const team = selectedPlayer.teamId === 'A' ? teamA : teamB;
    const player = team?.players?.find(p => p.id === selectedPlayer.playerId);

    if(!team || !player) return;

    const newEvent: Omit<GameEvent, 'id' | 'matchId'> = {
        type: type,
        teamId: team.id,
        playerId: player.id,
        playerName: player.name,
        teamName: team.name,
        timestamp: state.time,
        playerInId: null,
        playerInName: null,
    };
    
    dispatch({ type: 'ADD_EVENT', payload: { event: newEvent } });
    createGameEvent(newEvent);
  };

  const getPlayerInfo = () => {
    if (substitutionState) {
        const team = substitutionState.playerOut.teamId === 'A' ? teamA : teamB;
        const player = team?.players?.find(p => p.id === substitutionState.playerOut.playerId);
        return player ? `Sale: ${player.name}. Seleccione quién entra.` : 'Procesando cambio...';
    }
    if (!selectedPlayer) return null;
    const team = selectedPlayer.teamId === 'A' ? teamA : teamB;
    const player = team?.players?.find(p => p.id === selectedPlayer.playerId);
    return player ? `${player.name} (#${player.number})` : null;
  }

  const selectedPlayerInfo = getPlayerInfo();

  const canRegisterAction = !!selectedPlayer;
  
  if (substitutionState) {
    return (
       <Card className="w-full shadow-md">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg text-primary">Realizando Cambio</CardTitle>
                <CardDescription className="h-5 text-blue-500 font-semibold animate-pulse">
                    {selectedPlayerInfo || 'Seleccione un jugador para que entre'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center flex-wrap gap-3 pt-4">
                 <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                    <Button 
                        onClick={() => dispatch({ type: 'CANCEL_SUBSTITUTION' })}
                        variant="destructive"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancelar Cambio
                    </Button>
                </motion.div>
            </CardContent>
       </Card>
    )
  }


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
                disabled={!canRegisterAction}
                aria-label="Registrar gol"
            >
              <Goal className="mr-2 h-4 w-4" />
              Gol
            </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
            <Button 
                onClick={() => handleAddEvent('ASSIST')} 
                disabled={!canRegisterAction}
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
            disabled={!canRegisterAction}
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
            disabled={!canRegisterAction}
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
            disabled={!canRegisterAction}
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
            disabled={!canRegisterAction}
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
                disabled={!canRegisterAction}
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
