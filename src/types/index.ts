
import type { FC, ReactNode, SVGProps } from 'react';
import { ImageProps } from 'next/image';

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

export type GameEventType = 'GOAL' | 'ASSIST' | 'FOUL' | 'SHOT' | 'YELLOW_CARD' | 'RED_CARD' | 'TIMEOUT';

export interface GameEvent {
  id: string;
  type: GameEventType;
  teamId: 'A' | 'B';
  playerId: number;
  playerName: string;
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
} | null;

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
  selectedPlayer: SelectedPlayer;
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
  icon?: React.FC<Omit<ImageProps, 'src' | 'alt'>>;
  imageUrl: string;
  color: string;
  textColor?: string;
}
