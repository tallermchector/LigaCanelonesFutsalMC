
'use client';

import type { GameState, FullMatch, GameEvent, SelectedPlayer, GameEventType, MatchStatus } from '@/types';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

type GameAction =
  | { type: 'LOAD_MATCH'; payload: { match: FullMatch; state: GameState | null } }
  | { type: 'UPDATE_SCORE'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_FOULS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'UPDATE_TIMEOUTS'; payload: { team: 'A' | 'B'; delta: number } }
  | { type: 'SET_PERIOD'; payload: number }
  | { type: 'SET_STATUS'; payload: MatchStatus }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'SELECT_PLAYER'; payload: SelectedPlayer }
  | { type: 'ADD_EVENT'; payload: { type: GameEventType; teamId?: 'A' | 'B' } };

const initialState: GameState = {
  matchId: null,
  status: 'SCHEDULED',
  teamA: null,
  teamB: null,
  scoreA: 0,
  scoreB: 0,
  foulsA: 0,
  foulsB: 0,
  timeoutsA: 0,
  timeoutsB: 0,
  period: 1,
  time: 1200,
  isRunning: false,
  events: [],
  selectedPlayer: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_MATCH':
      return action.payload.state || {
        ...initialState,
        matchId: action.payload.match.id,
        status: action.payload.match.status,
        teamA: action.payload.match.teamA,
        teamB: action.payload.match.teamB,
        scoreA: action.payload.match.scoreA,
        scoreB: action.payload.match.scoreB,
        events: action.payload.match.events || [],
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
      return { ...state, period: action.payload, time: initialState.time, isRunning: false };
    case 'SET_STATUS':
        return { ...state, status: action.payload };
    case 'TOGGLE_TIMER':
      if (state.status === 'SCHEDULED' && !state.isRunning) {
        return { ...state, isRunning: true, status: 'LIVE' };
      }
      return { ...state, isRunning: !state.isRunning };
    case 'RESET_TIMER':
      return { ...state, time: initialState.time, isRunning: false };
    case 'TICK':
      if (state.isRunning && state.time > 0) {
        return { ...state, time: state.time - 1 };
      }
       if (state.isRunning && state.time === 0) {
        return { ...state, isRunning: false };
      }
      return state;
    case 'SELECT_PLAYER':
      if (state.selectedPlayer?.playerId === action.payload?.playerId && state.selectedPlayer?.teamId === action.payload?.teamId) {
          return { ...state, selectedPlayer: null };
      }
      return { ...state, selectedPlayer: action.payload };
    case 'ADD_EVENT': {
      let teamId = state.selectedPlayer?.teamId;
      let playerId = state.selectedPlayer?.playerId;

      if (action.payload.type === 'TIMEOUT') {
        if (!action.payload.teamId) return state;
        teamId = action.payload.teamId;
        playerId = -1; // System event, no specific player
      }

      if (!teamId) return state;
      
      const team = teamId === 'A' ? state.teamA : state.teamB;
      const player = team?.players?.find(p => p.id === playerId);

      if (!team || (playerId !== -1 && !player)) return state;

      const newEvent: GameEvent = {
          id: `${Date.now()}-${Math.random()}`,
          type: action.payload.type,
          teamId,
          playerId: playerId!,
          playerName: player?.name || 'Equipo',
          teamName: team.name,
          timestamp: state.time,
      };
      
      const newState = { ...state, events: [...state.events, newEvent] };

      if (action.payload.type === 'GOAL') {
          return gameReducer(newState, { type: 'UPDATE_SCORE', payload: { team: teamId, delta: 1 } });
      }
      if (action.payload.type === 'FOUL') {
          return gameReducer(newState, { type: 'UPDATE_FOULS', payload: { team: teamId, delta: 1 } });
      }
       if (action.payload.type === 'TIMEOUT') {
          return gameReducer(newState, { type: 'UPDATE_TIMEOUTS', payload: { team: teamId, delta: -1 } });
      }

      return newState;
    }
    default:
      return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> } | undefined>(undefined);

export const GameProvider = ({ children, match }: { children: ReactNode, match: FullMatch }) => {
  const getInitialState = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(`futsal-match-state-${match.id}`);
        return savedState ? JSON.parse(savedState) : null;
      }
    } catch (error) {
      console.error("Failed to read state from localStorage", error);
    }
    return null;
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_MATCH', payload: { match, state: getInitialState() } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id]);
  
  useEffect(() => {
    if (state.matchId && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`futsal-match-state-${state.matchId}`, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state]);

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
