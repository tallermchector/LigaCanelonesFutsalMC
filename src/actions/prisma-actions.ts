
'use server';

import prisma from '@/lib/prisma';
import type { GameState, FullMatch, MatchStats, GameEvent, MatchStatus, Team, Player, GameEventType, PlayerTimeTracker } from '@/types';

/**
 * Saves the current state of a match to the database.
 * This includes updating the match details and player statistics in a transaction.
 *
 * @param {number} matchId - The ID of the match to save the state for.
 * @param {GameState} state - The current state of the match.
 * @returns {Promise<void>} A promise that resolves when the state has been saved.
 * @throws {Error} If the provided match state is invalid or if the database operation fails.
 */
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

            // Find which team the player belongs to
            const playerTeamA = state.teamA.players.find(p => p.id === playerId);
            const teamId = playerTeamA ? state.teamA.id : state.teamB.id;

            txs.push(
                prisma.playerMatchStats.upsert({
                    where: { matchId_playerId: { matchId, playerId } },
                    update: { 
                        timePlayedInSeconds: stats.totalTime,
                        teamId: teamId, 
                    },
                    create: {
                        matchId,
                        playerId,
                        teamId: teamId,
                        timePlayedInSeconds: stats.totalTime,
                    },
                })
            );
        }
    }

    await prisma.$transaction(txs);

  } catch (error) {
    console.error(`Failed to save match state for ${matchId}:`, error);
    throw new Error('Database operation failed.');
  }
}

/**
 * Creates a new game event and saves it to the database.
 *
 * @param {number} matchId - The ID of the match the event belongs to.
 * @param {Omit<GameEvent, 'id' | 'matchId'>} event - The game event to create.
 * @returns {Promise<void>} A promise that resolves when the event has been created.
 */
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
    } catch(error) {
        console.error(`Failed to create event for match ${matchId}:`, error);
        // We don't throw here, as it might interrupt the game flow on the client.
        // Logging is sufficient for background persistence.
    }
}


/**
 * Retrieves a single match by its ID from the database.
 *
 * @param {number} id - The ID of the match to retrieve.
 * @returns {Promise<FullMatch | undefined>} A promise that resolves to the full match object, or undefined if not found.
 */
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

/**
 * Retrieves all matches from the database.
 *
 * @returns {Promise<FullMatch[]>} A promise that resolves to an array of all matches.
 */
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


/**
 * Retrieves the statistics for a specific match from the database.
 *
 * @param {number} id - The ID of the match to retrieve statistics for.
 * @returns {Promise<MatchStats | undefined>} A promise that resolves to the match statistics, or undefined if the match is not found.
 */
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

/**
 * Creates a new match in the database.
 *
 * @param {object} data - The data for the new match.
 * @param {number} data.teamAId - The ID of team A.
 * @param {number} data.teamBId - The ID of team B.
 * @param {Date} data.scheduledTime - The scheduled time of the match.
 * @param {number} data.round - The round number of the match.
 * @returns {Promise<FullMatch>} A promise that resolves to the newly created match.
 * @throws {Error} If the match could not be created in the database.
 */
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

/**
 * Updates the status of a match in the database.
 *
 * @param {number} matchId - The ID of the match to update.
 * @param {MatchStatus} status - The new status of the match.
 * @returns {Promise<void>} A promise that resolves when the match status has been updated.
 * @throws {Error} If the match status could not be updated.
 */
export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<void> {
    try {
        await prisma.match.update({
            where: { id: matchId },
            data: { status },
        });
    } catch (error) {
        console.error(`Failed to update match ${matchId} status:`, error);
        throw new Error("Could not update match status.");
    }
}
