'use server';

import prisma from '@/lib/prisma';
import type { SeasonTeam, Team } from '@prisma/client';

// Definimos un tipo más específico para el resultado que esperamos
type StandingWithTeam = SeasonTeam & { team: Team };

/**
 * Obtiene la tabla de posiciones para una temporada específica.
 * @param seasonId - El ID de la temporada para la que se obtendrá la tabla.
 * @returns Una promesa que se resuelve en un array con los datos de la tabla de posiciones.
 */
export async function getStandings(seasonId: number): Promise<StandingWithTeam[]> {
    try {
        // Aseguramos que el cliente de Prisma tenga el modelo `seasonTeam`
        if (!prisma.seasonTeam) {
            throw new Error("El modelo 'SeasonTeam' no se encuentra en el cliente de Prisma. Revisa tu schema.prisma y regenera el cliente.");
        }

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
        
        // Aseguramos el tipo de retorno
        return standings as StandingWithTeam[];

    } catch (error) {
        console.error(`Error al obtener la tabla de posiciones para la temporada ${seasonId}:`, error);
        // Devolvemos un array vacío en caso de error para evitar que la página se rompa.
        return [];
    }
}
