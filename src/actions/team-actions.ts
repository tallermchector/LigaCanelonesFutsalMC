

'use server';

import prisma from '@/lib/prisma';
import type { FullMatch, GameEventType, Team } from '@/types';

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
        return teams as Team[];
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
}


export async function getTeamBySlug(slug: string): Promise<Team | null> {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: {
                players: true,
            }
        });
        
        if (!team) return null;

        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { teamAId: team.id },
                    { teamBId: team.id }
                ]
            },
            include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
                events: true,
                playerMatchStats: true,
            },
            orderBy: {
                scheduledTime: 'asc'
            }
        });
        
        const fullMatches: FullMatch[] = matches.map(match => ({
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
            events: match.events.map(e => ({...e, type: e.type as GameEventType})),
        }) as FullMatch);


        return { ...team, matches: fullMatches } as Team;

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
}
