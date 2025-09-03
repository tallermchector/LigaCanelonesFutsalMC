
'use client';

import { useState, useEffect } from 'react';
import type { GameState, FullMatch } from '@/types';

export function useLiveMatchState(matchId: number | null, initialMatchData: FullMatch | null): GameState | null {
  const [liveState, setLiveState] = useState<GameState | null>(null);

  const getInitialState = (): GameState | null => {
    try {
      if (typeof window !== 'undefined' && matchId) {
        const savedState = localStorage.getItem(`futsal-match-state-${matchId}`);
        if (savedState) {
            return JSON.parse(savedState) as GameState;
        }
      }
    } catch (e) {
        console.error("Could not parse saved state", e);
    }
    
    if (initialMatchData) {
        return {
          matchId: initialMatchData.id,
          status: initialMatchData.status,
          teamA: initialMatchData.teamA,
          teamB: initialMatchData.teamB,
          scoreA: initialMatchData.scoreA,
          scoreB: initialMatchData.scoreB,
          foulsA: initialMatchData.foulsA,
          foulsB: initialMatchData.foulsB,
          timeoutsA: initialMatchData.timeoutsA,
          timeoutsB: initialMatchData.timeoutsB,
          period: initialMatchData.period,
          time: initialMatchData.time,
          isRunning: initialMatchData.isRunning,
          events: initialMatchData.events || [],
          selectedPlayer: null,
          substitutionState: null,
          activePlayersA: initialMatchData.activePlayersA || [],
          activePlayersB: initialMatchData.activePlayersB || [],
          playerPositions: {},
          playerTimeTracker: {},
        }
    }
    return null;
  }
  
  // Set initial state from localStorage or props
  useEffect(() => {
    setLiveState(getInitialState());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, initialMatchData]);


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

  return liveState;
}

