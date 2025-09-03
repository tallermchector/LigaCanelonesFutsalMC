'use server';

import prisma from '@/lib/prisma';

/**
 * Obtiene la tabla de posiciones para una temporada específica.
 * @param seasonId - El ID de la temporada para la que se obtendrá la tabla.
 * @returns Una promesa que se resuelve en un array con los datos de la tabla de posiciones.
 */
export async function getStandings(seasonId: number) {
    try {
        const standings = await prisma.seasonTeam.findMany({
            where: {
                seasonId: seasonId,
            },
            include: {
                team: true, // Incluye la información completa del equipo
            },
            orderBy: {
                position: 'asc', // Ordena por la posición en la tabla
            },
        });
        return standings;
    } catch (error) {
        console.error(`Error al obtener la tabla de posiciones para la temporada ${seasonId}:`, error);
        return [];
    }
}
