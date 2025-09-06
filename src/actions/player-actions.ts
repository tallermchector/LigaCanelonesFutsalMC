
'use server';

import prisma from '@/lib/prisma';
import type { Player, Team, PlayerStat, PlayerWithStats } from '@/types';
import { getAllMatches, getMatchStats } from './prisma-actions';

/**
 * Retrieves a list of all players from the database, including their team.
 * @returns {Promise<(Player & { team: Team })[]>} A promise that resolves to an array of Player objects with their team.
 */
export async function getAllPlayers(): Promise<(Player & { team: Team })[]> {
    try {
        const players = await prisma.player.findMany({
            include: {
                team: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        return players as (Player & { team: Team })[];
    } catch (error) {
        console.error('Error al obtener todos los jugadores:', error);
        return [];
    }
}

/**
 * Retrieves a specific player by their ID.
 * @param {number} id - The ID of the player to retrieve.
 * @returns {Promise<(Player & { team: Team }) | null>} A promise that resolves to the player object with their team, or null if not found.
 */
export async function getPlayerById(id: number): Promise<(Player & { team: Team }) | null> {
    try {
        const player = await prisma.player.findUnique({
            where: { id },
            include: {
                team: true,
            },
        });

        if (!player) {
            return null;
        }
        
        return player as (Player & { team: Team });

    } catch (error) {
        console.error(`Error al obtener el jugador con id ${id}:`, error);
        return null;
    }
}

/**
 * Aggregates player stats from all finished matches.
 * @returns {Promise<PlayerWithStats[]>} A promise that resolves to an array of players with their aggregated stats.
 */
export async function getAggregatedPlayerStats(): Promise<PlayerWithStats[]> {
    const allMatches = await getAllMatches();
    const finishedMatches = allMatches.filter(m => m.status === 'FINISHED');

    const playerStatsMap: { [playerId: number]: { player: PlayerStat['player'], goals: number, assists: number, matchesPlayed: number } } = {};

    for (const match of finishedMatches) {
        const stats = await getMatchStats(match.id);
        if (!stats) continue;

        const processStats = (statArray: PlayerStat[], type: 'goals' | 'assists') => {
            statArray.forEach(stat => {
                if (!playerStatsMap[stat.player.id]) {
                    playerStatsMap[stat.player.id] = {
                        player: stat.player,
                        goals: 0,
                        assists: 0,
                        matchesPlayed: 0,
                    };
                }
                if (type === 'goals') {
                    playerStatsMap[stat.player.id].goals += stat.count;
                } else {
                    playerStatsMap[stat.player.id].assists += stat.count;
                }
            });
        };

        processStats(stats.stats.topScorers, 'goals');
        processStats(stats.stats.assistsLeaders, 'assists');
        
        const playersInMatch = new Set<number>();
        stats.teamA.players.forEach(p => playersInMatch.add(p.id));
        stats.teamB.players.forEach(p => playersInMatch.add(p.id));

        playersInMatch.forEach(playerId => {
             if (playerStatsMap[playerId]) {
                playerStatsMap[playerId].matchesPlayed += 1;
            } else {
                 const allPlayers = [...stats.teamA.players, ...stats.teamB.players];
                 const player = allPlayers.find(p => p.id === playerId);
                 if (player) {
                    playerStatsMap[playerId] = {
                        player: { ...player, team: player.teamId === stats.teamA.id ? stats.teamA : stats.teamB },
                        goals: 0,
                        assists: 0,
                        matchesPlayed: 1,
                    };
                 }
            }
        });
    }

    return Object.values(playerStatsMap).map(p => ({
        ...p.player,
        goals: p.goals,
        assists: p.assists,
        matchesPlayed: p.matchesPlayed,
    }));
}
