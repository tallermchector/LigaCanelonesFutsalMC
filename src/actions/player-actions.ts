
'use server';

import prisma from '@/lib/prisma';
import type { Player, Team } from '@/types';

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
