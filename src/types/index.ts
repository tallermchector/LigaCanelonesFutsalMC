import type { ElementType } from 'react';
import type { Match as PrismaMatch, Team as PrismaTeam, Player as PrismaPlayer, GameEvent as PrismaGameEvent } from '@prisma/client';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'SELECTING_STARTERS';

export interface Player extends PrismaPlayer {}

export interface Team extends PrismaTeam {
  players: Player[];
}

export type GameEventType = 'GOAL' | 'ASSIST' | 'FOUL' | 'SHOT' | 'YELLOW_CARD' | 'RED_CARD' | 'TIMEOUT' | 'SUBSTITUTION';

export interface GameEvent extends Omit<PrismaGameEvent, 'matchId' | 'type'> {
    type: GameEventType;
}

export interface FullMatch extends Omit<PrismaMatch, 'teamAId' | 'teamBId' | 'events' | 'scheduledTime' | 'status'> {
  scheduledTime: string; 
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
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
  activePlayersA: number[];
  activePlayersB: number[];
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
