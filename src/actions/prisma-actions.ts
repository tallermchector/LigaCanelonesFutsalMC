
'use server';

import prisma from '@/lib/prisma';
import type { GameState, FullMatch, MatchStats, GameEvent as GameEventType } from '@/types';

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
            events: match.events.map(e => ({...e, type: e.type as GameEventType['type']})),
        };
    } catch (error) {
        console.error(`Failed to fetch match ${id} from DB:`, error);
        return undefined;
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
        acc[event.playerId] = (acc[event.playerId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    return Object.entries(eventCounts)
      .map(([playerId, count]) => {
        const player = allPlayers.find(p => p.id === parseInt(playerId, 10));
        return player ? { player, count } : null;
      })
      .filter((p): p is { player: any, count: number } => p !== null)
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
