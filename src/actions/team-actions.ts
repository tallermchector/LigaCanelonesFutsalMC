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
        return teams.map(team => ({
            ...team,
            slug: team.name.toLowerCase().replace(/\s+/g, '-'),
        }));
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
}


export async function getTeamBySlug(slug: string): Promise<Team | null> {
    try {
        const teams = await getAllTeams();
        const team = teams.find(t => t.slug === slug);
        
        if (!team) return null;

        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { teamAId: team.id },
                    { teamBId: team.id }
                ]
            },
            include: {
                teamA: true,
                teamB: true
            },
            orderBy: {
                scheduledTime: 'asc'
            }
        });

        return { ...team, matches };

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
}