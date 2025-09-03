
'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TacticalHeader } from './TacticalHeader';
import { ActionsToolbar } from './ActionsToolbar';
import { DraggablePlayer } from './DraggablePlayer';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, Player } from '@/types';
import { useEffect, useState } from 'react';

type PlayerPosition = { id: number; x: number; y: number };

export function TacticalBoard({ match }: { match: FullMatch }) {
  const { state } = useGame();
  const [positionsA, setPositionsA] = useState<PlayerPosition[]>([]);
  const [positionsB, setPositionsB] = useState<PlayerPosition[]>([]);

  useEffect(() => {
    const getPlayerById = (id: number, teamPlayers: Player[]): Player | undefined => {
        return teamPlayers.find(p => p.id === id);
    }

    const initPositions = (playerIds: number[], teamPlayers: Player[], team: 'A' | 'B'): PlayerPosition[] => {
        if (!teamPlayers || playerIds.length === 0) return [];
        
        const goalkeeper = playerIds.map(id => getPlayerById(id, teamPlayers)).find(p => p?.position === 'Goalkeeper');
        const fieldPlayers = playerIds.filter(id => id !== goalkeeper?.id);

        const formation: PlayerPosition[] = [];

        // Goalkeeper position
        if (goalkeeper) {
            formation.push({
                id: goalkeeper.id,
                x: team === 'A' ? 10 : 90,
                y: 50,
            });
        }
        
        // 1-2-1 Formation for field players
        const formationSpots = team === 'A' ? 
            [{x: 25, y: 50}, {x: 40, y: 25}, {x: 40, y: 75}, {x: 55, y: 50}] : // Team A (left)
            [{x: 75, y: 50}, {x: 60, y: 25}, {x: 60, y: 75}, {x: 45, y: 50}];   // Team B (right)
        
        fieldPlayers.forEach((playerId, index) => {
            if (index < formationSpots.length) {
                 formation.push({
                    id: playerId,
                    x: formationSpots[index].x,
                    y: formationSpots[index].y,
                });
            }
        });

        return formation;
    };
    
    if (state.teamA) {
        setPositionsA(initPositions(state.activePlayersA, state.teamA.players, 'A'));
    }
    if (state.teamB) {
        setPositionsB(initPositions(state.activePlayersB, state.teamB.players, 'B'));
    }

  }, [state.activePlayersA, state.activePlayersB, state.teamA, state.teamB]);


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
