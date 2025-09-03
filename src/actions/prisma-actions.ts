
'use server';

import prisma from '@/lib/prisma';
import type { GameState, FullMatch, MatchStats, GameEvent, MatchStatus, Team, Player, GameEventType, PlayerTimeTracker } from '@/types';
import { revalidatePath } from 'next/cache';

export async function saveMatchState(matchId: number, state: GameState): Promise<void> {
  if (!state.teamA || !state.teamB) {
    throw new Error('Invalid match state provided.');
  }

  const { status, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, isRunning, activePlayersA, activePlayersB, playerTimeTracker } = state;

  try {
    const txs: any[] = [
      prisma.match.update({
        where: { id: matchId },
        data: {
          status,
          scoreA,
          scoreB,
          foulsA,
          foulsB,
          timeoutsA,
          timeoutsB,
          period,
          time,
          isRunning,
          activePlayersA,
          activePlayersB,
        },
      })
    ];

    if (playerTimeTracker) {
        for (const playerIdStr in playerTimeTracker) {
            const playerId = parseInt(playerIdStr, 10);
            const stats = playerTimeTracker[playerId];

            txs.push(
                prisma.playerMatchStats.upsert({
                    where: { matchId_playerId: { matchId, playerId } },
                    update: { timePlayedInSeconds: stats.totalTime },
                    create: {
                        matchId,
                        playerId,
                        timePlayedInSeconds: stats.totalTime,
                    },
                })
            );
        }
    }

    await prisma.$transaction(txs);

    console.log(`Match ${matchId} state saved successfully.`);
    revalidatePath(`/controles/${matchId}`);
    revalidatePath('/controles');
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
                type: event.type,
                teamId: event.teamId,
                playerId: event.playerId,
                playerName: event.playerName,
                playerInId: event.playerInId,
                playerInName: event.playerInName,
                teamName: event.teamName,
                timestamp: event.timestamp,
            },
        });
        console.log(`Event ${event.type} for match ${matchId} created successfully.`);
        revalidatePath(`/partidos/${matchId}/estadisticas`);
    } catch(error) {
        console.error(`Failed to create event for match ${matchId}:`, error);
        // We don't throw here, as it might interrupt the game flow on the client.
        // Logging is sufficient for background persistence.
    }
}


export async function getMatchByIdFromDb(id: number): Promise<FullMatch | undefined> {
    try {
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
                events: true,
                playerMatchStats: true,
            },
        });

        if (!match) {
            return undefined;
        }

        return {
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
            events: match.events.map(e => ({...e, type: e.type as GameEventType})),
        } as FullMatch;
    } catch (error) {
        console.error(`Failed to fetch match ${id} from DB:`, error);
        return undefined;
    }
}

export async function getAllMatchesFromDb(): Promise<FullMatch[]> {
    try {
        const matches = await prisma.match.findMany({
            include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
                events: true,
                playerMatchStats: true,
            },
             orderBy: {
                scheduledTime: 'desc',
            },
        });
        
        return matches.map((match) => ({
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
            events: match.events.map(e => ({...e, type: e.type as GameEventType})),
        }) as FullMatch);

    } catch (error) {
        console.error(`Failed to fetch all matches from DB:`, error);
        return [];
    }
}


export async function getMatchStatsFromDb(id: number): Promise<MatchStats | undefined> {
  const match = await getMatchByIdFromDb(id);
  if (!match || !match.events) {
    return undefined;
  }
    
  const allPlayersWithTeam = [
      ...match.teamA.players.map(p => ({...p, team: match.teamA})), 
      ...match.teamB.players.map(p => ({...p, team: match.teamB}))
  ];

  const getStatsForType = (eventType: GameEventType) => {
    const eventCounts = match.events!
      .filter(event => event.type === eventType)
      .reduce((acc, event) => {
        if(!event.playerId) return acc;
        acc[event.playerId] = (acc[event.playerId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    return Object.entries(eventCounts)
      .map(([playerId, count]) => {
        const player = allPlayersWithTeam.find(p => p.id === parseInt(playerId, 10));
        return player ? { player, count } : null;
      })
      .filter((p): p is { player: Player & { team: Team }, count: number } => p !== null)
      .sort((a, b) => b.count - a.count);
  };
  
  return {
    ...match,
    stats: {
      topScorers: getStatsForType('GOAL'),
      assistsLeaders: getStatsForType('ASSIST'),
      foulsByPlayer: getStatsForType('FOUL'),
      shotsByPlayer: getStatsForType('SHOT'),
    },
  };
}

export async function createMatch(data: {
    teamAId: number;
    teamBId: number;
    scheduledTime: Date;
    round: number;
}): Promise<FullMatch> {
    try {
        const newMatch = await prisma.match.create({
            data: {
                ...data,
                status: 'SCHEDULED',
                scoreA: 0,
                scoreB: 0,
                foulsA: 0,
                foulsB: 0,
                timeoutsA: 1,
                timeoutsB: 1,
                period: 1,
                time: 1200,
                isRunning: false,
                activePlayersA: [],
                activePlayersB: [],
            },
            include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
                events: true,
                playerMatchStats: true,
            },
        });
        revalidatePath('/gestion');
        return {
            ...newMatch,
            scheduledTime: newMatch.scheduledTime.toISOString(),
            status: newMatch.status as MatchStatus,
            events: newMatch.events.map(e => ({...e, type: e.type as GameEventType}))
        } as FullMatch;
    } catch (error) {
        console.error("Failed to create match:", error);
        throw new Error("Could not create match in the database.");
    }
}

export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<void> {
    try {
        await prisma.match.update({
            where: { id: matchId },
            data: { status },
        });
        revalidatePath('/gestion');
        revalidatePath(`/controles/${matchId}`);
    } catch (error) {
        console.error(`Failed to update match ${matchId} status:`, error);
        throw new Error("Could not update match status.");
    }
}
