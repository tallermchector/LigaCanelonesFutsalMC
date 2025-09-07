

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameState, FullMatch } from '@/types';

export function useLiveMatchState(matchId: number | null, initialMatchData: FullMatch | null): GameState | null {
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
  }, [matchId, initialMatchData]);

  const initialStateFromProps = (matchData: FullMatch): GameState => {
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
  }

  const [liveState, setLiveState] = useState<GameState | null>(getInitialState);

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
    
    let timer: NodeJS.Timeout;
    if (liveState?.isRunning && liveState.time > 0) {
        timer = setInterval(() => {
            setLiveState(prevState => prevState ? { ...prevState, time: Math.max(0, prevState.time - 1) } : null);
        }, 1000);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
       if (timer) {
        clearInterval(timer);
      }
    };
  }, [matchId, liveState?.isRunning]);

  return liveState;
}
