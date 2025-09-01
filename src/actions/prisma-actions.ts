
'use server';

import prisma from '@/lib/prisma';
import type { GameState, FullMatch, MatchStats, GameEvent as GameEventType, MatchStatus, Team, Player } from '@/types';
import { revalidatePath } from 'next/cache';

export async function saveMatchState(state: GameState): Promise<void> {
  if (!state.matchId || !state.teamA || !state.teamB) {
    throw new Error('Invalid match state provided.');
  }

  const { matchId, status, teamA, teamB, scoreA, scoreB, foulsA, foulsB, timeoutsA, timeoutsB, period, time, isRunning, events, activePlayersA, activePlayersB } = state;

  try {
    await prisma.match.upsert({
      where: { id: matchId },
      update: {
        status: status,
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
        events: {
          deleteMany: {}, // Clear existing events
          create: events.map(event => ({
            id: event.id,
            type: event.type,
            teamId: event.teamId,
            playerId: event.playerId,
            playerName: event.playerName,
            playerInId: event.playerInId,
            playerInName: event.playerInName,
            teamName: event.teamName,
            timestamp: event.timestamp,
          })),
        },
      },
      create: {
        id: matchId,
        scheduledTime: new Date(),
        status: status,
        teamAId: teamA.id,
        teamBId: teamB.id,
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
        round: 1, // Add a default round or get it from somewhere
        events: {
          create: events.map(event => ({
            id: event.id,
            type: event.type,
            teamId: event.teamId,
            playerId: event.playerId,
            playerName: event.playerName,
            playerInId: event.playerInId,
            playerInName: event.playerInName,
            teamName: event.teamName,
            timestamp: event.timestamp,
          })),
        },
      },
    });
    console.log(`Match ${matchId} state saved successfully.`);
  } catch (error) {
    console.error(`Failed to save match state for ${matchId}:`, error);
    throw new Error('Database operation failed.');
  }
}

export async function getMatchByIdFromDb(id: string): Promise<FullMatch | undefined> {
    try {
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
                events: true,
            },
        });

        if (!match) {
            return undefined;
        }

        return {
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
            events: match.events.map((e: GameEventType) => ({...e, type: e.type as GameEventType['type']})),
        };
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
            },
             orderBy: {
                scheduledTime: 'desc',
            },
        });
        
        return matches.map((match): FullMatch => ({
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
        }));

    } catch (error) {
        console.error(`Failed to fetch all matches from DB:`, error);
        return [];
    }
}


export async function getMatchStatsFromDb(id: string): Promise<MatchStats | undefined> {
  const match = await getMatchByIdFromDb(id);
  if (!match || !match.events) {
    return undefined;
  }
    
  const allPlayers = [...match.teamA.players, ...match.teamB.players];

  const getStatsForType = (eventType: GameEventType['type']) => {
    const eventCounts = match.events!
      .filter(event => event.type === eventType)
      .reduce((acc, event) => {
        if(!event.playerId) return acc;
        acc[event.playerId] = (acc[event.playerId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    return Object.entries(eventCounts)
      .map(([playerId, count]) => {
        const player = allPlayers.find(p => p.id === parseInt(playerId, 10));
        return player ? { player, count } : null;
      })
      .filter((p): p is { player: Player, count: number } => p !== null)
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


export async function getAllTeams(): Promise<Team[]> {
    try {
        return await prisma.team.findMany({ include: { players: true } });
    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return [];
    }
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
                id: `match-${Date.now()}`, // Simple unique ID
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
            },
        });
        revalidatePath('/gestion');
        return {
            ...newMatch,
            scheduledTime: newMatch.scheduledTime.toISOString(),
            status: newMatch.status as MatchStatus
        };
    } catch (error) {
        console.error("Failed to create match:", error);
        throw new Error("Could not create match in the database.");
    }
}

export async function updateMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
    try {
        await prisma.match.update({
            where: { id: matchId },
            data: { status },
        });
        revalidatePath('/gestion');
    } catch (error) {
        console.error(`Failed to update match ${matchId} status:`, error);
        throw new Error("Could not update match status.");
    }
}
