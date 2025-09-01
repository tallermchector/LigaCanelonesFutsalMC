
import type { ElementType } from 'react';

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
  players: Player[];
}

export type GameEventType = 'GOAL' | 'ASSIST' | 'FOUL' | 'SHOT' | 'YELLOW_CARD' | 'RED_CARD' | 'TIMEOUT' | 'SUBSTITUTION';

export interface GameEvent {
  id: string;
  type: GameEventType;
  teamId: 'A' | 'B';
  playerId: number; // For single-player events or player_out for substitutions
  playerName: string;
  playerInId?: number; // For substitutions
  playerInName?: string; // For substitutions
  teamName: string;
  timestamp: number; // Time in seconds when event occurred
}

export interface FullMatch {
  id: string;
  scheduledTime: string; 
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  events?: GameEvent[];
}

export type PlayerStat = {
  player: Player;
  count: number;
};

export interface MatchStats extends FullMatch {
  stats: {
    topScorers: PlayerStat[];
    assistsLeaders: PlayerStat[];
    foulsByPlayer: PlayerStat[];
    shotsByPlayer: PlayerStat[];
  };
}


export type SelectedPlayer = {
  teamId: 'A' | 'B';
  playerId: number;
};

export interface GameState {
  matchId: string | null;
  status: MatchStatus;
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
  events: GameEvent[];
  selectedPlayer: SelectedPlayer | null;
  substitutionState: {
      playerOut: SelectedPlayer;
  } | null;
}

export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
  category: string;
  excerpt: string;
};

export interface SocialLink {
  name: string;
  url: string;
  icon?: ElementType;
  imageUrl: string;
  color: string;
  textColor?: string;
}
