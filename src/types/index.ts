export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';

export interface Player {
  id: number;
  name: string;
  number: number;
  position: 'Goalkeeper' | 'Defender' | 'Winger' | 'Pivot';
}

export interface Team {
  id: number;
  name: string;
  logoUrl?: string;
  players?: Player[];
}

export interface FullMatch {
  id: string;
  scheduledTime: string; 
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
}

export interface GameState {
  matchId: string | null;
  teamA: Team | null;
  teamB: Team | null;
  scoreA: number;
  scoreB: number;
  foulsA: number;
  foulsB: number;
  timeoutsA: number;
  timeoutsB: number;
  period: number;
  time: number; // in seconds
  isRunning: boolean;
}
