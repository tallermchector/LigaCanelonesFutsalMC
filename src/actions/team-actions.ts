'use server';

import prisma from '@/lib/prisma';
import type { FullMatch, GameEventType, Team } from '@/types';
import { Prisma } from '@prisma/client';

// Define Prisma include options as constants for better type safety, reusability, and readability.

// Include definition for a Team object with its associated players.
const teamIncludePlayers = {
    players: true,
} satisfies Prisma.TeamInclude; // 'satisfies' ensures the object conforms to Prisma.TeamInclude while retaining literal types.

// Derived Prisma type for a Team including its players, using the include constant.
type TeamWithPlayers = Prisma.TeamGetPayload<{ include: typeof teamIncludePlayers }>;

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
            include: teamIncludePlayers, // Use the defined include constant
        });

        // Assuming 'Team' from '@/types' is structurally compatible with TeamWithPlayers.
        // If there are specific differences, a mapping function would be needed here.
        return teams as Team[];
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
}

// Include definition for a Match object with all its necessary relations.
const matchIncludeOptions = {
    teamA: { include: teamIncludePlayers }, // Reusing the team players include
    teamB: { include: teamIncludePlayers }, // Reusing the team players include
    events: true,
    playerMatchStats: true,
} satisfies Prisma.MatchInclude;

// Derived Prisma type for a Match including all specified relations, crucial for type correctness.
type MatchWithAllIncludes = Prisma.MatchGetPayload<{ include: typeof matchIncludeOptions }>;

/**
 * Type definition for a Team object extended with its associated matches.
 * This combines the Prisma-derived Team type with the external FullMatch type.
 */
type TeamWithMatches = TeamWithPlayers & {
    matches: FullMatch[];
};

export async function getTeamBySlug(slug: string): Promise<TeamWithMatches | null> {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: teamIncludePlayers, // Use the defined include constant
        });

        if (!team) {
            return null;
        }

        // Fetch matches, ensuring all relations are included and correctly typed.
        // The type for 'matches' is correctly inferred as MatchWithAllIncludes[] due to 'include' constant.
        const matches: MatchWithAllIncludes[] = await prisma.match.findMany({
            where: {
                OR: [
                    { teamAId: team.id },
                    { teamBId: team.id }
                ]
            },
            include: matchIncludeOptions, // Use the defined include constant
            orderBy: {
                scheduledTime: 'asc'
            }
        });

        // Map the Prisma-returned match objects to the 'FullMatch' type, performing necessary transformations.
        const fullMatches: FullMatch[] = matches.map((match): FullMatch => ({
            ...match,
            // Convert 'scheduledTime' from Date object to ISO string as required by 'FullMatch'.
            scheduledTime: match.scheduledTime.toISOString(),
            // Assert 'status' string to the specific union/enum type defined in FullMatch['status'].
            status: match.status as FullMatch['status'],
            // Map event objects, asserting 'type' string to 'GameEventType'.
            events: match.events.map((event) => ({
                ...event,
                type: event.type as GameEventType,
            })),
            // Other fields like id, scoreA, scoreB, teamA, teamB, playerMatchStats etc. are compatible directly.
        }));

        // Combine the fetched team data with the transformed matches.
        // The final result is asserted to TeamWithMatches, which is a union of
        // the Prisma-derived team type and the array of FullMatch objects.
        return { ...team, matches: fullMatches } as TeamWithMatches;

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
}