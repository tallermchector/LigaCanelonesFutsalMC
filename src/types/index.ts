export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';

export interface Team {
  id: number;
  name: string;
  logoUrl?: string;
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
