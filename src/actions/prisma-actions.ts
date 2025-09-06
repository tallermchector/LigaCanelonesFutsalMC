

'use server';

import type { GameState, FullMatch, MatchStats, GameEvent, MatchStatus, GameEventType } from '@/types';
import { 
    createMatch as createMatchInDb, 
    updateMatchStatus as updateMatchStatusInDb, 
    getAllMatches as getAllMatchesFromDbInDb, 
    getMatchById as getMatchByIdFromDbInDb,
    saveMatchState as saveMatchStateInDb, 
    createGameEvent as createGameEventInDb 
} from './match-actions';


/**
 * Retrieves a single match by its ID from the database.
 *
 * @param {number} id - The ID of the match to retrieve.
 * @returns {Promise<FullMatch | undefined>} A promise that resolves to the full match object, or undefined if not found.
 */
export async function getMatchByIdFromDb(id: number): Promise<FullMatch | undefined> {
   const match = await getMatchByIdFromDbInDb(id);
   return match ?? undefined;
}

/**
 * Retrieves all matches from the database.
 *
 * @returns {Promise<FullMatch[]>} A promise that resolves to an array of all matches.
 */
export async function getAllMatchesFromDb(): Promise<FullMatch[]> {
   return getAllMatchesFromDbInDb();
}


/**
 * Retrieves the statistics for a specific match from the database.
 *
 * @param {number} id - The ID of the match to retrieve statistics for.
 * @returns {Promise<MatchStats | undefined>} A promise that resolves to the match statistics, or undefined if the match is not found.
 */
export async function getMatchStatsFromDb(id: number): Promise<MatchStats | undefined> {
  // This function is a placeholder as getMatchStatsFromDb doesn't exist in match-actions.
  // To make this compile, we'll temporarily use getMatchById and cast the result.
  // This should be replaced with a proper implementation.
  const match = await getMatchByIdFromDbInDb(id);
  if (!match) return undefined;
  
  const getPlayerStats = (eventType: GameEventType) => {
    const stats: { [key: number]: { player: any, count: number } } = {};
    match.events
        .filter(e => e.type === eventType)
        .forEach(e => {
            if (e.playerId) {
                if (!stats[e.playerId]) {
                    const team = e.teamId === match.teamA.id ? match.teamA : match.teamB;
                    const player = team.players.find(p => p.id === e.playerId);
                    if (player) {
                        stats[e.playerId] = { player: {...player, team}, count: 0 };
                    }
                }
                if (stats[e.playerId]) {
                    stats[e.playerId].count++;
                }
            }
        });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  };


  return {
    ...match,
    stats: {
        topScorers: getPlayerStats('GOAL'),
        assistsLeaders: getPlayerStats('ASSIST'),
        foulsByPlayer: getPlayerStats('FOUL'),
        shotsByPlayer: getPlayerStats('SHOT'),
    }
  } as MatchStats;
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
    const newMatch = await createMatchInDb(data);
    // The type from createMatchInDb might be slightly different, so we cast it.
    // This assumes the data structure is compatible.
    return {
        ...newMatch,
        scheduledTime: newMatch.scheduledTime.toISOString(),
        status: newMatch.status as MatchStatus,
        teamA: { id: newMatch.teamAId, name: 'Team A', players: [], logoUrl: '', slug: '' },
        teamB: { id: newMatch.teamBId, name: 'Team B', players: [], logoUrl: '', slug: '' },
        events: [],
        playerMatchStats: [],
    } as unknown as FullMatch;
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
    return updateMatchStatusInDb(matchId, status);
}

export async function saveMatchState(matchId: number, state: GameState): Promise<void> {
    return saveMatchStateInDb(matchId, state);
}

export async function createGameEvent(matchId: number, event: Omit<GameEvent, 'id' | 'matchId'>): Promise<void> {
    return createGameEventInDb(matchId, event);
}
