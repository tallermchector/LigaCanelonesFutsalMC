
'use client';

import { useGame } from '@/contexts/GameProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Shield, Hand, Footprints } from 'lucide-react';
import type { GameEventType } from '@/types';

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
    return player ? `${player.name} (${team?.name})` : null;
  }

  const selectedPlayerInfo = getPlayerInfo();

  return (
    <Card className="w-full max-w-sm mt-8 shadow-md">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg text-primary">Registrar Evento</CardTitle>
        <CardDescription className="h-5">
            {selectedPlayerInfo ? `Para: ${selectedPlayerInfo}` : 'Seleccione un jugador'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-4">
        <Button 
            onClick={() => handleAddEvent('GOAL')} 
            disabled={!selectedPlayer}
            aria-label="Registrar gol"
        >
          <Goal className="mr-2 h-4 w-4" />
          Gol
        </Button>
        <Button 
            onClick={() => handleAddEvent('ASSIST')} 
            disabled={!selectedPlayer}
            aria-label="Registrar asistencia"
            variant="outline"
        >
          <Hand className="mr-2 h-4 w-4" />
          Asistencia
        </Button>
         <Button 
            onClick={() => handleAddEvent('SHOT')} 
            disabled={!selectedPlayer}
            aria-label="Registrar tiro al arco"
            variant="outline"
        >
          <Footprints className="mr-2 h-4 w-4" />
          Tiro al arco
        </Button>
        <Button 
            onClick={() => handleAddEvent('FOUL')} 
            disabled={!selectedPlayer}
            aria-label="Registrar falta"
            variant="destructive"
        >
          <Shield className="mr-2 h-4 w-4" />
          Falta
        </Button>
      </CardContent>
    </Card>
  );
}
