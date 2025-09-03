
'use server';

import prisma from '@/lib/prisma';
import type { FullMatch, GameEventType, Team } from '@/types';
import { Prisma } from '@prisma/client';

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

/**
 * Type definition for a Team object extended with its associated matches.
 * This is used specifically for the return type of getTeamBySlug.
 */
type TeamWithMatches = Team & {
    matches: FullMatch[];
};

/**
 * Type definition for a Match object from Prisma, including all specified relations.
 * This helps TypeScript correctly infer types within the `matches.map` function.
 */
type MatchWithAllIncludes = Prisma.MatchGetPayload<{
    include: {
        teamA: { include: { players: true } };
        teamB: { include: { players: true } };
        events: true;
        playerMatchStats: true;
    };
}>;

export async function getTeamBySlug(slug: string): Promise<TeamWithMatches | null> {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: {
                players: true,
            }
        });

        if (!team) return null;

        const matches: MatchWithAllIncludes[] = await prisma.match.findMany({
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

        const fullMatches: FullMatch[] = matches.map((match): FullMatch => ({
            ...match,
            scheduledTime: match.scheduledTime.toISOString(),
            status: match.status as FullMatch['status'],
            events: match.events.map((event) => ({
                ...event,
                type: event.type as GameEventType,
            })),
        }));

        return { ...team, matches: fullMatches } as TeamWithMatches;

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
}
