
'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TacticalHeader } from './TacticalHeader';
import { ActionsToolbar } from './ActionsToolbar';
import { DraggablePlayer } from './DraggablePlayer';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, PlayerPosition } from '@/types';
import { useEffect } from 'react';

export function TacticalBoard({ match }: { match: FullMatch }) {
  const { state, dispatch } = useGame();
  
  useEffect(() => {
    // Dispatch action to set initial positions when active players change
    if (state.teamA && state.teamB) {
        dispatch({ type: 'SET_INITIAL_POSITIONS' });
    }
  }, [state.activePlayersA, state.activePlayersB, state.teamA, state.teamB, dispatch]);


  const handleMovePlayer = (id: number, x: number, y: number) => {
    dispatch({
        type: 'UPDATE_PLAYER_POSITION',
        payload: { playerId: id, position: { x, y } }
    });
  };
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

  const allPlayers = [...state.teamA.players, ...state.teamB.players];
  const allActivePlayers = [...state.activePlayersA, ...state.activePlayersB];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-screen flex-col bg-[#1A2631] text-white">
        <TacticalHeader match={match} />

        <main className="relative flex-grow">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/cancha-futbol.png')" }}
          ></div>
          
          <div className="relative h-full w-full">
            {allActivePlayers.map(playerId => {
                const player = allPlayers.find(p => p.id === playerId);
                const position = state.playerPositions[playerId];

                if (!player || !position) return null;

                const isTeamA = state.teamA!.players.some(p => p.id === playerId);

                return (
                    <DraggablePlayer
                        key={player.id}
                        id={player.id}
                        number={player.number}
                        x={position.x}
                        y={position.y}
                        color={isTeamA ? 'blue' : 'red'}
                        onMove={(x, y) => handleMovePlayer(player.id, x, y)}
                    />
                );
            })}
          </div>
        </main>

        <ActionsToolbar />
      </div>
    </DndProvider>
  );
}
