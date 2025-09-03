
'use server';

import prisma from '@/lib/prisma';
import type { Player, Team } from '@/types';

/**
 * Obtiene una lista de todos los jugadores de la base de datos, incluyendo su equipo.
 * @returns Una promesa que se resuelve en un array de objetos Player con su equipo.
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
 * Obtiene un jugador específico por su ID.
 * @param id - El ID del jugador a obtener.
 * @returns Una promesa que se resuelve en el objeto del jugador con su equipo, o null si no se encuentra.
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
