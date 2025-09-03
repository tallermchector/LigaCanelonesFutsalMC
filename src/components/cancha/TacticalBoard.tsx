
'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TacticalHeader } from './TacticalHeader';
import { ActionsToolbar } from './ActionsToolbar';
import { DraggablePlayer } from './DraggablePlayer';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch } from '@/types';
import { useEffect, useState } from 'react';

type PlayerPosition = { id: number; x: number; y: number };

export function TacticalBoard({ match }: { match: FullMatch }) {
  const { state } = useGame();
  const [positionsA, setPositionsA] = useState<PlayerPosition[]>([]);
  const [positionsB, setPositionsB] = useState<PlayerPosition[]>([]);

  useEffect(() => {
    // Initialize positions when active players change
    const initPositions = (players: number[], team: 'A' | 'B') => {
        return players.map((playerId, index) => ({
            id: playerId,
            x: team === 'A' ? 20 + (index * 15) : 80 - (index * 15),
            y: 50
        }));
    };
    setPositionsA(initPositions(state.activePlayersA, 'A'));
    setPositionsB(initPositions(state.activePlayersB, 'B'));
  }, [state.activePlayersA, state.activePlayersB]);


  const handleMovePlayer = (id: number, x: number, y: number, teamId: 'A' | 'B') => {
    const setPositions = teamId === 'A' ? setPositionsA : setPositionsB;
    setPositions(prev => prev.map(p => (p.id === id ? { ...p, x, y } : p)));
  };
  
  if (!state.teamA || !state.teamB) {
      return null;
  }

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
            {positionsA.map(pos => {
              const player = state.teamA?.players.find(p => p.id === pos.id);
              if (!player) return null;
              return (
                <DraggablePlayer
                  key={player.id}
                  id={player.id}
                  number={player.number}
                  x={pos.x}
                  y={pos.y}
                  color="blue"
                  onMove={(x, y) => handleMovePlayer(player.id, x, y, 'A')}
                />
              );
            })}
             {positionsB.map(pos => {
              const player = state.teamB?.players.find(p => p.id === pos.id);
              if (!player) return null;
              return (
                <DraggablePlayer
                  key={player.id}
                  id={player.id}
                  number={player.number}
                  x={pos.x}
                  y={pos.y}
                  color="red"
                   onMove={(x, y) => handleMovePlayer(player.id, x, y, 'B')}
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
