

'use server';

import prisma from '@/lib/prisma';
import type { Match, Team, Player, GameEvent, MatchStatus, FullMatch as ClientFullMatch, PlayerMatchStats, GameState } from '@/types';
import { revalidatePath } from 'next/cache';

export type FullMatch = ClientFullMatch & {
  teamA: Team & { players: Player[] };
  teamB: Team & { players: Player[] };
};

export type LiveMatch = Match & {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  time: number; 
  period: number;
}

export type MatchWithTeams = Match & {
  teamA: Team;
  teamB: Team;
};

export type GameEventWithTeamAndPlayer = GameEvent & {
  team: Team;
  player: Player | null;
};

export type MatchStats = Match & {
  teamA: Team;
  teamB: Team;
  gameEvents: GameEventWithTeamAndPlayer[];
  stats: {
    teamA: { possession: number; shots: number; shotsOnTarget: number; };
    teamB: { possession: number; shots: number; shotsOnTarget: number; };
  };
  mvp: Player | null;
};

export type Matchday = {
  matchday: number;
  matches: MatchWithTeams[];
}

// --- Match Read Operations ---

export async function getMatchById(matchId: number): Promise<ClientFullMatch | null> {
    const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
            events: true,
            playerMatchStats: true,
        },
    });

    if (!match) return null;

    return {
        ...match,
        scheduledTime: match.scheduledTime.toISOString(),
        status: match.status as MatchStatus,
    } as ClientFullMatch;
}

export async function getAllMatches(): Promise<ClientFullMatch[]> {
  const matches = await prisma.match.findMany({
    include: {
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
        events: true,
        playerMatchStats: true,
    },
    orderBy: {
      scheduledTime: 'desc'
    }
  });

  return matches.map(match => ({
      ...match,
      scheduledTime: match.scheduledTime.toISOString(),
      status: match.status as MatchStatus,
  })) as ClientFullMatch[];
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const liveMatchesData = await prisma.match.findMany({
    where: { status: 'LIVE' },
    include: { teamA: true, teamB: true },
    orderBy: { scheduledTime: 'asc' },
  });

  return liveMatchesData.map((match) => ({
    ...match,
    scoreA: match.scoreA ?? 0,
    scoreB: match.scoreB ?? 0,
    time: match.time ?? 0,
    period: match.period ?? 1,
  }));
}

// --- Match Write Operations ---

export async function createMatch(data: {
    teamAId: number;
    teamBId: number;
    scheduledTime: Date;
    round: number;
}): Promise<Match> {
    const newMatch = await prisma.match.create({
        data: {
            ...data,
            status: 'SCHEDULED',
            scoreA: 0,
            scoreB: 0,
            period: 1,
            time: 1200,
            foulsA: 0,
            foulsB: 0,
            timeoutsA: 1,
            timeoutsB: 1,
            isRunning: false,
            activePlayersA: [],
            activePlayersB: [],
        }
    });
    revalidatePath('/gestion/partidos');
    return newMatch;
}

export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<void> {
  await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });
  revalidatePath('/controles');
  revalidatePath(`/controles/${matchId}`);
}


export async function saveMatchState(matchId: number, state: GameState): Promise<void> {
    if (!state.teamA || !state.teamB) {
        throw new Error('Invalid match state provided.');
    }

    const { status, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, isRunning, activePlayersA, activePlayersB, playerTimeTracker } = state;
    
    try {
        const updateMatchPromise = prisma.match.update({
            where: { id: matchId },
            data: {
                status, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB,
                period, time, isRunning, activePlayersA, activePlayersB,
            },
        });

        const playerStatPromises = Object.entries(playerTimeTracker).map(([playerIdStr, stats]) => {
            const playerId = parseInt(playerIdStr, 10);
            const player = state.teamA?.players.find(p => p.id === playerId) || state.teamB?.players.find(p => p.id === playerId);
            if (!player) return Promise.resolve();

            return prisma.playerMatchStats.upsert({
                where: { matchId_playerId: { matchId, playerId } },
                update: { timePlayedInSeconds: Math.floor(stats.totalTime) },
                create: {
                    matchId,
                    playerId,
                    teamId: player.teamId,
                    timePlayedInSeconds: Math.floor(stats.totalTime),
                },
            });
        });

        await prisma.$transaction([updateMatchPromise, ...playerStatPromises]);

    } catch (error) {
        console.error(`Failed to save match state for ${matchId}:`, error);
        throw new Error('Database operation failed.');
    }
}


export async function createGameEvent(matchId: number, event: Omit<GameEvent, 'id' | 'matchId'>): Promise<void> {
    try {
        await prisma.gameEvent.create({
            data: {
                matchId: matchId,
                ...event,
            },
        });
    } catch(error) {
        console.error(`Failed to create event for match ${matchId}:`, error);
    }
}
    
