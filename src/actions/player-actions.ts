
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
    const allPlayersWithTeam = await getAllPlayers();

    const playerStatsMap: { [playerId: number]: { player: PlayerWithStats, goals: number, assists: number, matchesPlayed: number, minutesPlayed: number } } = {};

    // Initialize all players
    allPlayersWithTeam.forEach(p => {
        playerStatsMap[p.id] = {
            player: { ...p, goals: 0, assists: 0, matchesPlayed: 0, minutesPlayed: 0, avgMinutesPerMatch: 0 },
            goals: 0,
            assists: 0,
            matchesPlayed: 0,
            minutesPlayed: 0
        };
    });


    for (const match of finishedMatches) {
        const stats = await getMatchStats(match.id);
        if (!stats) continue;

        const processStats = (statArray: PlayerStat[], type: 'goals' | 'assists') => {
            statArray.forEach(stat => {
                if (!playerStatsMap[stat.player.id]) return;

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
            }
        });
        
        match.playerMatchStats.forEach(stat => {
            if (playerStatsMap[stat.playerId]) {
                playerStatsMap[stat.playerId].minutesPlayed += stat.timePlayedInSeconds;
            }
        });
    }

    return Object.values(playerStatsMap).map(p => {
        const matchesPlayed = p.matchesPlayed || 0;
        const minutesPlayed = Math.floor(p.minutesPlayed / 60);
        const avgMinutesPerMatch = matchesPlayed > 0 ? parseFloat((minutesPlayed / matchesPlayed).toFixed(1)) : 0;
        
        return {
            ...p.player,
            goals: p.goals,
            assists: p.assists,
            matchesPlayed,
            minutesPlayed,
            avgMinutesPerMatch,
        };
    });
}
