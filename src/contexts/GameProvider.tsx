
'use client';

import type { GameState, FullMatch, GameEvent, SelectedPlayer, GameEventType } from '@/types';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

type GameAction =
  | { type: 'LOAD_MATCH'; payload: FullMatch }
  | { type: 'UPDATE_SCORE'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_FOULS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_TIMEOUTS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'SET_PERIOD'; payload: number }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'SELECT_PLAYER'; payload: SelectedPlayer }
  | { type: 'ADD_EVENT'; payload: { type: GameEventType } };

const initialState: GameState = {
  matchId: null,
  teamA: null,
  teamB: null,
  scoreA: 0,
  scoreB: 0,
  foulsA: 0,
  foulsB: 0,
  timeoutsA: 1, // Standard 1 timeout per half
  timeoutsB: 1,
  period: 1,
  time: 1200, // 20 minutes in seconds
  isRunning: false,
  events: [],
  selectedPlayer: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_MATCH':
        return {
            ...initialState, // Reset state when loading a new match
            matchId: action.payload.id,
            teamA: action.payload.teamA,
            teamB: action.payload.teamB,
            scoreA: action.payload.scoreA,
            scoreB: action.payload.scoreB,
        };
    case 'UPDATE_SCORE':
      if (action.payload.team === 'A') {
        return { ...state, scoreA: Math.max(0, state.scoreA + action.payload.delta) };
      }
      return { ...state, scoreB: Math.max(0, state.scoreB + action.payload.delta) };
    case 'UPDATE_FOULS':
      if (action.payload.team === 'A') {
        return { ...state, foulsA: Math.max(0, state.foulsA + action.payload.delta) };
      }
      return { ...state, foulsB: Math.max(0, state.foulsB + action.payload.delta) };
    case 'UPDATE_TIMEOUTS':
       if (action.payload.team === 'A') {
        return { ...state, timeoutsA: Math.max(0, state.timeoutsA + action.payload.delta) };
      }
      return { ...state, timeoutsB: Math.max(0, state.timeoutsB + action.payload.delta) };
    case 'SET_PERIOD':
      return { ...state, period: action.payload };
    case 'TOGGLE_TIMER':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_TIMER':
      return { ...state, time: initialState.time, isRunning: false };
    case 'TICK':
      if (state.isRunning && state.time > 0) {
        return { ...state, time: state.time - 1 };
      }
      return { ...state, isRunning: false };
    case 'SELECT_PLAYER':
        // If the same player is clicked again, deselect them
        if (state.selectedPlayer?.playerId === action.payload.playerId && state.selectedPlayer?.teamId === action.payload.teamId) {
            return { ...state, selectedPlayer: null };
        }
        return { ...state, selectedPlayer: action.payload };
    case 'ADD_EVENT':
        if (!state.selectedPlayer) {
            return state;
        }

        const { teamId, playerId } = state.selectedPlayer;
        const team = teamId === 'A' ? state.teamA : state.teamB;
        const player = team?.players?.find(p => p.id === playerId);

        if (!team || !player) {
            return state;
        }

        const newEvent: GameEvent = {
            id: `${Date.now()}-${Math.random()}`,
            type: action.payload.type,
            teamId,
            playerId,
            playerName: player.name,
            teamName: team.name,
            timestamp: state.time,
        };
        
        const newState = { ...state, events: [...state.events, newEvent] };

        // Automatically update score or fouls based on event type
        if (action.payload.type === 'GOAL') {
            return gameReducer(newState, { type: 'UPDATE_SCORE', payload: { team: teamId, delta: 1 } });
        }
        if (action.payload.type === 'FOUL') {
            return gameReducer(newState, { type: 'UPDATE_FOULS', payload: { team: teamId, delta: 1 } });
        }

        return newState;
    default:
      return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> } | undefined>(undefined);

export const GameProvider = ({ children, match }: { children: ReactNode, match: FullMatch }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    dispatch({ type: 'LOAD_MATCH', payload: match });
  }, [match]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (state.isRunning && state.time > 0) {
      timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    };
  }, [state.isRunning, state.time]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
