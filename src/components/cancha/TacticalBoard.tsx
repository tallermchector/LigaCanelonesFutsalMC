
'use client';

import { DraggablePlayer } from './DraggablePlayer';
import { useGame } from '@/contexts/GameProvider';
import type { FullMatch, PlayerPosition } from '@/types';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

const ItemTypes = {
  PLAYER: 'player',
};

export function TacticalBoard({ match }: { match: FullMatch }) {
  const { state, dispatch } = useGame();
  const boardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (state.teamA && state.teamB && Object.keys(state.playerPositions).length === 0) {
        dispatch({ type: 'SET_INITIAL_POSITIONS' });
    }
  }, [state.activePlayersA, state.activePlayersB, state.teamA, state.teamB, dispatch]);


  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item: { id: number }, monitor) => {
        if (!boardRef.current) return;
        const boardRect = boardRef.current.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const x = ((clientOffset.x - boardRect.left) / boardRect.width) * 100;
        const y = ((clientOffset.y - boardRect.top) / boardRect.height) * 100;

        dispatch({
            type: 'UPDATE_PLAYER_POSITION',
            payload: { playerId: item.id, position: { x, y } }
        });

        // This allows DraggablePlayer to know the drop coords
        return { x, y };
    },
  }));

  // Combine the drop ref with our own boardRef
  const dropRef = (el: HTMLDivElement | null) => {
    if (el) {
      drop(el);
      (boardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };


  if (!state.teamA || !state.teamB) {
      return null;
  }

  const allPlayers = [...state.teamA.players, ...state.teamB.players];
  const allActivePlayers = [...state.activePlayersA, ...state.activePlayersB];

  return (
    <div
      ref={dropRef}
      className="relative w-full max-w-full aspect-[16/9] bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/cancha-futbol.png')" }}
    >
        {allActivePlayers.map(playerId => {
            const player = allPlayers.find(p => p.id === playerId);
            const position = state.playerPositions[playerId];

            if (!player || !position) return null;

            const isTeamA = state.teamA!.players.some(p => p.id === playerId);

            return (
                <DraggablePlayer
                    key={player.id}
                    player={player}
                    x={position.x}
                    y={position.y}
                    color={isTeamA ? 'blue' : 'red'}
                    onMove={(x, y) => {
                        dispatch({
                            type: 'UPDATE_PLAYER_POSITION',
                            payload: { playerId: player.id, position: { x, y } }
                        });
                    }}
                />
            );
        })}
    </div>
  );
}
