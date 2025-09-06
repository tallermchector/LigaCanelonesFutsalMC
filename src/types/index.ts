

import type { ElementType } from 'react';
import type { Season as PrismaSeason, Match as PrismaMatch, Team as PrismaTeam, Player as PrismaPlayer, GameEvent as PrismaGameEvent, PlayerMatchStats as PrismaPlayerMatchStats, SeasonTeam as PrismaSeasonTeam } from '@prisma/client';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'SELECTING_STARTERS'| 'POSTPONED' | 'IN_PROGRESS' ;
export type PlayerPositionType = "GOLERO" | "DEFENSA" | "ALA" | "PIVOT";

export interface Player extends Omit<PrismaPlayer, 'position'> {
    position: PlayerPositionType;
    avatarUrl?: string | null;
}

export interface PlayerMatchStats extends PrismaPlayerMatchStats {}

export interface Season extends PrismaSeason {}

export interface SeasonTeam extends PrismaSeasonTeam {}

export interface Team extends Omit<PrismaTeam, 'slug'> {
  slug: string;
  players: Player[];
  matches?: FullMatch[];
}

export type GameEventType = 'GOAL' | 'ASSIST' | 'FOUL' | 'SHOT' | 'YELLOW_CARD' | 'RED_CARD' | 'TIMEOUT' | 'SUBSTITUTION';

export interface GameEvent extends Omit<PrismaGameEvent, 'type'> {
    type: GameEventType;
}

export interface FullMatch extends Omit<PrismaMatch, 'teamAId' | 'teamBId' | 'events' | 'scheduledTime' | 'status'> {
  scheduledTime: string; 
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  events: GameEvent[];
  playerMatchStats: PlayerMatchStats[];
}

export type PlayerStat = {
  player: Player & { team: Team };
  count: number;
};

export interface PlayerWithStats extends Player {
    goals: number;
    assists: number;
    matchesPlayed: number;
    team: Team;
}

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

export type PlayerPosition = {
    x: number;
    y: number;
};

export type PlayerTimeTracker = {
    [playerId: number]: {
        startTime: number; // Game clock time when player entered
        totalTime: number; // Accumulated time in seconds
    };
};

export interface GameState {
  matchId: number | null;
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
  playerPositions: { [playerId: number]: PlayerPosition };
  playerTimeTracker: PlayerTimeTracker;
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
