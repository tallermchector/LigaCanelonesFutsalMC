

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, FullMatch } from '@/types';

export function useLiveMatchState(matchId: number | null, initialMatchData: FullMatch | null): GameState | null {
  const initialStateFromProps = useCallback((matchData: FullMatch): GameState => {
      return {
          matchId: matchData.id,
          status: matchData.status,
          teamA: matchData.teamA,
          teamB: matchData.teamB,
          scoreA: matchData.scoreA,
          scoreB: matchData.scoreB,
          foulsA: matchData.foulsA,
          foulsB: matchData.foulsB,
          timeoutsA: matchData.timeoutsA,
          timeoutsB: matchData.timeoutsB,
          period: matchData.period,
          time: matchData.time,
          isRunning: matchData.isRunning,
          events: matchData.events || [],
          selectedPlayer: null,
          substitutionState: null,
          activePlayersA: matchData.activePlayersA || [],
          activePlayersB: matchData.activePlayersB || [],
          playerPositions: {},
          playerTimeTracker: {},
          updatedAt: matchData.updatedAt
      }
  }, []);

  const getInitialState = useCallback((): GameState | null => {
    let localState: GameState | null = null;
    try {
      if (typeof window !== 'undefined' && matchId) {
        const savedStateJSON = localStorage.getItem(`futsal-match-state-${matchId}`);
        if (savedStateJSON) {
            localState = JSON.parse(savedStateJSON) as GameState;
        }
      }
    } catch (e) {
        console.error("Could not parse saved state", e);
        localState = null;
    }
    
    // Prioritize the most recent state
    if (localState && initialMatchData) {
        const localDate = localState.updatedAt ? new Date(localState.updatedAt) : new Date(0);
        const serverDate = initialMatchData.updatedAt ? new Date(initialMatchData.updatedAt) : new Date(0);

        if (serverDate > localDate) {
            // Server state is newer, use it as the base
             return {
                ...initialStateFromProps(initialMatchData),
                events: initialMatchData.events || []
             };
        }
    }

    if (localState) {
        return localState;
    }
    
    if (initialMatchData) {
        return initialStateFromProps(initialMatchData);
    }

    return null;
  }, [matchId, initialMatchData, initialStateFromProps]);

  const [liveState, setLiveState] = useState<GameState | null>(getInitialState);
  const lastTickRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initialState = getInitialState();
     if (initialState?.isRunning && initialState.updatedAt) {
      const timeSinceUpdate = (Date.now() - new Date(initialState.updatedAt).getTime()) / 1000;
      const newTime = Math.max(0, initialState.time - timeSinceUpdate);
      setLiveState({ ...initialState, time: newTime });
    } else {
      setLiveState(initialState);
    }
  }, [initialMatchData, getInitialState]);


  useEffect(() => {
    if (typeof window === 'undefined' || !matchId) {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `futsal-match-state-${matchId}` && event.newValue) {
        try {
          const newState = JSON.parse(event.newValue) as GameState;
          setLiveState(newState);
        } catch (error) {
          console.error("Failed to parse live state update from localStorage", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [matchId]);

   useEffect(() => {
    if (liveState?.isRunning && liveState.time > 0) {
      lastTickRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (lastTickRef.current) {
          const now = Date.now();
          const timePassed = (now - lastTickRef.current) / 1000;
          lastTickRef.current = now;
          setLiveState(prevState => {
            if (!prevState) return null;
            const newTime = Math.max(0, prevState.time - timePassed);
            if (newTime <= 0) {
              clearInterval(timerRef.current!);
              return { ...prevState, time: 0, isRunning: false };
            }
            return { ...prevState, time: newTime };
          });
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        lastTickRef.current = null;
      }
    };
  }, [liveState?.isRunning]);


  return liveState;
}
