'use server';

import prisma from '@/lib/prisma';
import type { Team } from '@/types';

/**
 * Obtiene una lista de todos los equipos de la base de datos.
 * @returns Una promesa que se resuelve en un array de objetos Team.
 */
export async function getAllTeams(): Promise<Team[]> {
    try {
        const teams = await prisma.team.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                players: true, // Incluimos los jugadores para que el tipo Team sea completo
            },
        });
        return teams;
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
}
