
'use server';

import prisma from '@/lib/prisma';
import type { Season, SeasonTeam, Team } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAllTeams as getAllTeamsFromSource } from './team-actions';

// Definimos un tipo más específico para el resultado que esperamos
type StandingWithTeam = SeasonTeam & { team: Team };

/**
 * Obtiene la tabla de posiciones para una temporada específica.
 * @param seasonId - El ID de la temporada para la que se obtendrá la tabla.
 * @returns Una promesa que se resuelve en un array con los datos de la tabla de posiciones.
 */
export async function getStandings(seasonId: number): Promise<StandingWithTeam[]> {
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
        
        // Aseguramos el tipo de retorno
        return standings as StandingWithTeam[];

    } catch (error) {
        console.error(`Error al obtener la tabla de posiciones para la temporada ${seasonId}:`, error);
        // Devolvemos un array vacío en caso de error para evitar que la página se rompa.
        return [];
    }
}


export async function getAllSeasonsWithTeams(): Promise<(Season & { teams: SeasonTeam[] })[]> {
    try {
        return await prisma.season.findMany({
            include: {
                teams: true,
            },
            orderBy: {
                year: 'desc',
            },
        });
    } catch (error) {
        console.error('Error al obtener las temporadas:', error);
        return [];
    }
}

export async function createSeason(name: string, year: number): Promise<Season> {
    try {
        const season = await prisma.season.create({
            data: {
                name,
                year,
            },
        });
        revalidatePath('/gestion/temporadas');
        return season;
    } catch (error) {
        console.error('Error al crear la temporada:', error);
        throw new Error('No se pudo crear la temporada.');
    }
}

// Reutilizamos la función que ya existe en team-actions.ts para no duplicar código
export async function getAllTeams(): Promise<Team[]> {
    return getAllTeamsFromSource();
}

export async function addTeamToSeason(seasonId: number, teamId: number): Promise<SeasonTeam> {
    try {
        // Verificar si el equipo ya está en la temporada
        const existingEntry = await prisma.seasonTeam.findUnique({
            where: {
                seasonId_teamId: {
                    seasonId,
                    teamId,
                },
            },
        });

        if (existingEntry) {
            throw new Error('El equipo ya está registrado en esta temporada.');
        }

        const newSeasonTeam = await prisma.seasonTeam.create({
            data: {
                seasonId,
                teamId,
                position: 0,
                points: 0,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
            },
        });
        revalidatePath('/gestion/temporadas');
        return newSeasonTeam;
    } catch (error) {
        console.error('Error al añadir equipo a la temporada:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('No se pudo añadir el equipo a la temporada.');
    }
}
