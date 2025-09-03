
'use client';

import type { GameState, FullMatch, GameEvent, SelectedPlayer, GameEventType, MatchStatus, Player, PlayerPosition } from '@/types';
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { createGameEvent, saveMatchState } from '@/actions/prisma-actions';
import { useToast } from '@/hooks/use-toast';


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
  | { type: 'ADD_EVENT'; payload: { type: GameEventType; teamId?: 'A' | 'B' } }
  | { type: 'INITIATE_SUBSTITUTION' }
  | { type: 'CANCEL_SUBSTITUTION' }
  | { type: 'TOGGLE_ACTIVE_PLAYER'; payload: { teamId: 'A' | 'B'; playerId: number } }
  | { type: 'SET_INITIAL_POSITIONS' }
  | { type: 'SAVE_FULL_STATE'; }
  | { type: 'UPDATE_PLAYER_POSITION'; payload: { playerId: number; position: PlayerPosition } };

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
  substitutionState: null,
  activePlayersA: [],
  activePlayersB: [],
  playerPositions: {},
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_MATCH': {
      const baseState = action.payload.state || {
        ...initialState,
        matchId: action.payload.match.id,
        status: action.payload.match.status,
        teamA: action.payload.match.teamA,
        teamB: action.payload.match.teamB,
        scoreA: action.payload.match.scoreA,
        scoreB: action.payload.match.scoreB,
        events: action.payload.match.events || [],
        activePlayersA: action.payload.match.activePlayersA || [],
        activePlayersB: action.payload.match.activePlayersB || [],
        substitutionState: null,
        playerPositions: {},
      };
      // Ensure active players arrays exist
      if (!baseState.activePlayersA) baseState.activePlayersA = [];
      if (!baseState.activePlayersB) baseState.activePlayersB = [];
      return baseState;
    }
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
    case 'SELECT_PLAYER': {
        const selected = action.payload;

        if (state.substitutionState) {
            const { playerOut } = state.substitutionState;

            // Only allow selecting a different player from the same team
            if (selected.teamId === playerOut.teamId && selected.playerId !== playerOut.playerId) {
                const team = playerOut.teamId === 'A' ? state.teamA : state.teamB;
                const pOut = team?.players.find(p => p.id === playerOut.playerId);
                const pIn = team?.players.find(p => p.id === selected.playerId);
                
                if (!team || !pOut || !pIn) return state;

                const newEvent: GameEvent = {
                    id: `${Date.now()}-${Math.random()}`,
                    type: 'SUBSTITUTION',
                    teamId: playerOut.teamId,
                    playerId: pOut.id,
                    playerName: pOut.name,
                    playerInId: pIn.id,
                    playerInName: pIn.name,
                    teamName: team.name,
                    timestamp: state.time,
                };
                
                 // Update active players list
                const activePlayersKey = playerOut.teamId === 'A' ? 'activePlayersA' : 'activePlayersB';
                const currentActivePlayers = state[activePlayersKey];
                const updatedActivePlayers = currentActivePlayers.filter(id => id !== pOut.id).concat(pIn.id);

                return {
                    ...state,
                    events: [...state.events, newEvent],
                    selectedPlayer: null,
                    substitutionState: null,
                    [activePlayersKey]: updatedActivePlayers,
                };
            }
            // If the same player is selected again, or a player from another team, cancel substitution
            return { ...state, substitutionState: null, selectedPlayer: null };
        }

        if (state.selectedPlayer?.playerId === selected.playerId && state.selectedPlayer?.teamId === selected.teamId) {
            return { ...state, selectedPlayer: null };
        }

        return { ...state, selectedPlayer: selected };
    }
    case 'ADD_EVENT': {
      if (!state.selectedPlayer) return state;
      
      const { teamId, playerId } = state.selectedPlayer;
      
      const team = teamId === 'A' ? state.teamA : state.teamB;
      const player = team?.players?.find(p => p.id === playerId);

      if (!team || !player) return state;

      const newEvent: GameEvent = {
          id: `${Date.now()}-${Math.random()}`,
          type: action.payload.type,
          teamId,
          playerId,
          playerName: player.name,
          teamName: team.name,
          timestamp: state.time,
      };
      
      let newState = { ...state, events: [...state.events, newEvent], selectedPlayer: null };

      // Chain updates for relevant event types
      if (action.payload.type === 'GOAL') {
          newState = gameReducer(newState, { type: 'UPDATE_SCORE', payload: { team: teamId, delta: 1 } });
      }
      if (action.payload.type === 'FOUL') {
          newState = gameReducer(newState, { type: 'UPDATE_FOULS', payload: { team: teamId, delta: 1 } });
      }
      if (action.payload.type === 'TIMEOUT') {
          const timeoutTeamId = action.payload.teamId || teamId;
          newState = gameReducer(newState, { type: 'UPDATE_TIMEOUTS', payload: { team: timeoutTeamId, delta: -1 } });
      }

      return newState;
    }
    case 'INITIATE_SUBSTITUTION':
        if (!state.selectedPlayer) return state;
        return {
            ...state,
            substitutionState: { playerOut: state.selectedPlayer },
            selectedPlayer: null,
        };
    case 'CANCEL_SUBSTITUTION':
        return { ...state, substitutionState: null };
    
    case 'TOGGLE_ACTIVE_PLAYER': {
        const { teamId, playerId } = action.payload;
        const activePlayersKey = teamId === 'A' ? 'activePlayersA' : 'activePlayersB';
        const currentActivePlayers: number[] = state[activePlayersKey];
        const isCurrentlyActive = currentActivePlayers.includes(playerId);
        
        let updatedActivePlayers: number[];
        
        if (isCurrentlyActive) {
            updatedActivePlayers = currentActivePlayers.filter(id => id !== playerId);
        } else {
            if (currentActivePlayers.length < 5) {
                updatedActivePlayers = [...currentActivePlayers, playerId];
            } else {
                console.warn(`Team ${teamId} already has 5 active players.`);
                return state;
            }
        }
        
        return {
            ...state,
            [activePlayersKey]: updatedActivePlayers,
        };
    }
    case 'SET_INITIAL_POSITIONS': {
        if (!state.teamA || !state.teamB) return state;

        const newPositions: { [playerId: number]: PlayerPosition } = {};

        const setPositionsForTeam = (playerIds: number[], teamPlayers: Player[], team: 'A' | 'B') => {
            const goalkeeper = playerIds.map(id => teamPlayers.find(p => p.id === id)).find(p => p?.position === 'Goalkeeper');
            let fieldPlayers = playerIds.filter(id => id !== goalkeeper?.id);
            
            // If no designated goalkeeper, pick one player to be in goal
            if (!goalkeeper && playerIds.length > 0) {
                const tempGoalkeeperId = playerIds[0];
                newPositions[tempGoalkeeperId] = { x: team === 'A' ? 10 : 90, y: 50 };
                fieldPlayers = playerIds.slice(1);
            } else if (goalkeeper) {
                 newPositions[goalkeeper.id] = { x: team === 'A' ? 10 : 90, y: 50 };
            }

            const formationSpots = team === 'A' 
                ? [{x: 35, y: 50}, {x: 25, y: 25}, {x: 25, y: 75}, {x: 45, y: 50}] 
                : [{x: 65, y: 50}, {x: 75, y: 25}, {x: 75, y: 75}, {x: 55, y: 50}];
            
            fieldPlayers.forEach((playerId, index) => {
                if (index < formationSpots.length) {
                    newPositions[playerId] = formationSpots[index];
                }
            });
        };

        setPositionsForTeam(state.activePlayersA, state.teamA.players, 'A');
        setPositionsForTeam(state.activePlayersB, state.teamB.players, 'B');

        return { ...state, playerPositions: newPositions };
    }
    case 'UPDATE_PLAYER_POSITION': {
        const { playerId, position } = action.payload;
        return {
            ...state,
            playerPositions: {
                ...state.playerPositions,
                [playerId]: position,
            },
        };
    }
    case 'SAVE_FULL_STATE': {
      // This action does not modify the state directly.
      // It's a signal to trigger the save operation in the provider.
      return state;
    }
    default:
      return state;
  }
};

const GameContext = createContext<{ 
    state: GameState; 
    dispatch: React.Dispatch<GameAction>;
    handleSaveChanges: () => Promise<void>;
} | undefined>(undefined);

export const GameProvider = ({ children, match }: { children: ReactNode, match: FullMatch }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  const getInitialState = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem(`futsal-match-state-${match.id}`);
        const parsedState = savedState ? JSON.parse(savedState) : null;
        if (parsedState) {
          // Ensure new state fields are initialized
          parsedState.substitutionState = null;
          if (!parsedState.activePlayersA) parsedState.activePlayersA = match.activePlayersA || [];
          if (!parsedState.activePlayersB) parsedState.activePlayersB = match.activePlayersB || [];
          if (!parsedState.playerPositions) parsedState.playerPositions = {};
        }
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to read state from localStorage", error);
    }
    return null;
  };

  useEffect(() => {
    dispatch({ type: 'LOAD_MATCH', payload: { match, state: getInitialState() } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id]);
  
  // Persist state to localStorage on every change
  useEffect(() => {
    if (state.matchId && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`futsal-match-state-${state.matchId}`, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state]);

  // Persist event to DB on change
  useEffect(() => {
    if(state.events.length > 0) {
      const lastEvent = state.events[state.events.length -1];
      if (state.matchId && lastEvent) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...eventData } = lastEvent;
        createGameEvent(state.matchId, eventData);
      }
    }
  }, [state.events, state.matchId]);

  // Timer logic
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

  const handleSaveChanges = useCallback(async () => {
    if (!state.matchId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se puede guardar un partido sin ID.",
      });
      return;
    }
    try {
      await saveMatchState(state.matchId, state);
      toast({
        title: "Éxito",
        description: "El estado del partido ha sido guardado correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar el estado del partido en la base de datos.",
      });
      console.error("Failed to save match state:", error);
    }
  }, [state, toast]);

  return (
    <GameContext.Provider value={{ state, dispatch, handleSaveChanges }}>
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
