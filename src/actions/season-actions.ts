
'use server';

import prisma from '@/lib/prisma';
import type { Season, SeasonTeam, Team } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAllTeams as getAllTeamsFromSource } from './team-actions';

// Definimos un tipo más específico para el resultado que esperamos
type StandingWithTeam = SeasonTeam & { team: Team };

/**
 * Retrieves the standings for a specific season.
 * @param {number} seasonId - The ID of the season to retrieve the standings for.
 * @returns {Promise<StandingWithTeam[]>} A promise that resolves to an array with the standings data.
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


/**
 * Retrieves all seasons from the database, including the teams associated with each season.
 * @returns {Promise<(Season & { teams: SeasonTeam[] })[]>} A promise that resolves to an array of seasons with their teams.
 */
export async function getAllSeasonsWithTeams(): Promise<(Season & { teams: SeasonTeam[] })[]> {
    try {
        return await prisma.season.findMany({
            include: {
                teams: {
                  include: {
                    team: true
                  }
                }
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

/**
 * Creates a new season in the database.
 * @param {string} name - The name of the season.
 * @param {number} year - The year of the season.
 * @returns {Promise<Season>} A promise that resolves to the newly created season.
 * @throws {Error} If the season could not be created.
 */
export async function createSeason(name: string, year: number): Promise<Season> {
    const season = await prisma.season.create({
        data: {
            name,
            year,
        },
    });
    revalidatePath('/gestion/temporadas');
    return season;
}

/**
 * Adds a list of teams to a specific season.
 * It checks for existing teams to avoid duplicates.
 * @param {number} seasonId - The ID of the season to add teams to.
 * @param {number[]} teamIds - An array of team IDs to add to the season.
 * @returns {Promise<void>} A promise that resolves when the teams have been added.
 * @throws {Error} If the teams are already in the season or if the operation fails.
 */
export async function addTeamsToSeason(seasonId: number, teamIds: number[]): Promise<void> {
    const existingTeams = await prisma.seasonTeam.findMany({
        where: {
            seasonId,
            teamId: { in: teamIds },
        },
        select: {
            teamId: true,
        },
    });

    const existingTeamIds = new Set(existingTeams.map(t => t.teamId));
    const newTeamIds = teamIds.filter(id => !existingTeamIds.has(id));

    if (newTeamIds.length === 0) {
        throw new Error('Todos los equipos seleccionados ya están en esta temporada.');
    }

    const dataToCreate = newTeamIds.map(teamId => ({
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
    }));

    await prisma.seasonTeam.createMany({
        data: dataToCreate,
    });

    revalidatePath('/gestion/temporadas');
}


/**
 * Retrieves all teams from the database.
 * This function is a re-export from `team-actions.ts` to avoid code duplication.
 * @returns {Promise<Team[]>} A promise that resolves to an array of all teams.
 */
export async function getAllTeams(): Promise<Team[]> {
    return getAllTeamsFromSource();
}
