

'use server';

import prisma from '@/lib/prisma';
// FIX: Import Prisma-generated types directly from '@prisma/client'
import type { Team, Player, GameEvent as PrismaGameEvent, Match, PlayerMatchStats, Prisma, MatchStatus, EventType } from '@prisma/client';
// FIX: Keep client-specific types from the local types file
import type { GameState, GameEvent as ClientGameEvent } from '@/types';
import { revalidatePath } from 'next/cache';

// --- Type Definitions for this Action File ---

export type FullMatch = Match & {
  teamA: Team & { players: Player[] };
  teamB: Team & { players: Player[] };
  events: PrismaGameEvent[];
  playerMatchStats: PlayerMatchStats[];
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

export type GameEventWithTeamAndPlayer = PrismaGameEvent & {
  team: Team;
  player: Player | null;
};

export type MatchStats = FullMatch & {
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

export async function getMatchById(matchId: number): Promise<FullMatch | null> {
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

    return match;
}

export async function getAllMatches(): Promise<FullMatch[]> {
  const matches = await prisma.match.findMany({
    include: {
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
        events: true,
        playerMatchStats: true,
    }
  });

  return matches;
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const liveMatchesData = await prisma.match.findMany({
    // FIX: Use the correct Enum type from Prisma for status
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
    seasonId: number;
}): Promise<FullMatch> { // Return FullMatch to include relations
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
    
    // FIX: Re-fetch the match to include all relations and return the full object.
    // This solves type errors when updating the client-side state.
    const fullNewMatch = await getMatchById(newMatch.id);
    if (!fullNewMatch) {
        throw new Error("Failed to re-fetch newly created match.");
    }
    return fullNewMatch;
}

export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<void> {
  await prisma.match.update({
    where: { id: matchId },
    // FIX: Ensure status aligns with Prisma's MatchStatus enum
    data: { status },
  });
  revalidatePath('/partidos');
  revalidatePath(`/partidos/${matchId}`);
  revalidatePath(`/controles`);
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
                // FIX: Cast status to the Prisma-generated MatchStatus type
                status: status as MatchStatus,
                scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB,
                period, time, isRunning, activePlayersA, activePlayersB,
            },
        });

        // FIX: This logic is now safer. It filters out players not found in the state and ensures
        // the transaction array only contains valid Prisma promises.
        const playerStatPromises = Object.entries(playerTimeTracker).map(([playerIdStr, stats]) => {
            const playerId = parseInt(playerIdStr, 10);
            const player = state.teamA?.players.find(p => p.id === playerId) || state.teamB?.players.find(p => p.id === playerId);
            if (!player) return null; // Return null if player not found

            return prisma.playerMatchStats.upsert({
                where: { matchId_playerId: { matchId, playerId } },
                update: {
                  timePlayedInSeconds: Math.floor(stats.totalTime),
                },
                create: {
                    matchId,
                    playerId,
                    timePlayedInSeconds: Math.floor(stats.totalTime),
                    // FIX: Removed teamId as it's not in the schema for this model
                },
            });
        }).filter((p): p is NonNullable<typeof p> => p !== null);

        // FIX: Ensure the transaction only receives valid Prisma promises
        await prisma.$transaction([updateMatchPromise, ...playerStatPromises]);

    } catch (error) {
        console.error(`Failed to save match state for ${matchId}:`, error);
        throw new Error('Database operation failed.');
    }
}


export async function createGameEvent(matchId: number, event: Omit<ClientGameEvent, 'id' | 'matchId'>): Promise<void> {
    try {
        await prisma.gameEvent.create({
            data: {
                matchId: matchId,
                ...event,
                // FIX: Ensure the event type from the client matches Prisma's EventType enum
                type: event.type as EventType,
            },
        });
        revalidatePath(`/partidos/${matchId}`);
    } catch(error) {
        console.error(`Failed to create event for match ${matchId}:`, error);
        throw new Error('Could not create game event.');
    }
}
    
export async function generateFixture(seasonId: number, teamIds: number[]): Promise<Prisma.BatchPayload> {
    if (teamIds.length < 2) {
        throw new Error("Se necesitan al menos dos equipos para generar un fixture.");
    }

    const matchesToCreate: Prisma.MatchCreateManyInput[] = [];
    const scheduleDate = new Date();
    scheduleDate.setHours(19, 0, 0, 0); // Start matches at 19:00

    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            matchesToCreate.push({
                teamAId: teamIds[i],
                teamBId: teamIds[j],
                seasonId, // FIX: Added seasonId to align with the updated schema
                round: (i + j - 1),
                scheduledTime: new Date(scheduleDate),
                status: 'SCHEDULED',
                scoreA: 0,
                scoreB: 0,
                period: 1,
                time: 1200,
                foulsA: 0,
                foulsB: 0,
                timeoutsA: 1,
                timeoutsB: 1,
            });

            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }
    }
    
    revalidatePath('/gestion/partidos');
    return prisma.match.createMany({
        data: matchesToCreate,
        skipDuplicates: true,
    });
}
