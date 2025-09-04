
'use server';

import prisma from '@/lib/prisma';
import type { FullMatch, GameEventType, Team } from '@/types';
import { Prisma } from '@prisma/client';

// Define Prisma include options as constants for better type safety, reusability, and readability.

// Include definition for a Team object with its associated players.
/**
 * Prisma include options to fetch a team with its associated players.
 */
const teamIncludePlayers = {
    players: true,
} satisfies Prisma.TeamInclude; // 'satisfies' ensures the object conforms to Prisma.TeamInclude while retaining literal types.

// Derived Prisma type for a Team including its players, using the include constant.
/**
 * Represents a team with its associated players, derived from Prisma types.
 */
type TeamWithPlayers = Prisma.TeamGetPayload<{ include: typeof teamIncludePlayers }>;

/**
 * Retrieves a list of all teams from the database.
 * @returns {Promise<Team[]>} A promise that resolves to an array of Team objects.
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
        return teams as Team[];
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        return [];
    }
}

// Include definition for a Match object with all its necessary relations.
/**
 * Prisma include options to fetch a match with all its necessary relations,
 * including both teams with their players, events, and player match stats.
 */
const matchIncludeOptions = {
    teamA: { include: teamIncludePlayers }, // Reusing the team players include
    teamB: { include: teamIncludePlayers }, // Reusing the team players include
    events: true,
    playerMatchStats: true,
} satisfies Prisma.MatchInclude;


/**
 * Type definition for a Team object extended with its associated matches.
 */
type TeamWithMatches = TeamWithPlayers & {
    matches: FullMatch[];
};

/**
 * Retrieves a single team by its slug, including all its players and matches.
 * @param {string} slug - The slug of the team to retrieve.
 * @returns {Promise<TeamWithMatches | null>} A promise that resolves to the team object with its matches, or null if not found.
 */
export async function getTeamBySlug(slug: string): Promise<TeamWithMatches | null> {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: teamIncludePlayers, // Use the defined include constant
        });

        if (!team) {
            return null;
        }

        // Fetch matches, letting TypeScript infer the type from the result.
        // This avoids conflicts with derived Prisma types.
        const matches = await prisma.match.findMany({
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

        // Explicitly map the Prisma match object to our custom FullMatch type.
        const fullMatches: FullMatch[] = matches.map((match) => {
            return {
                ...match,
                scheduledTime: match.scheduledTime.toISOString(),
                status: match.status as FullMatch['status'],
                events: match.events.map((event: { type: string; }) => ({
                    ...event,
                    type: event.type as GameEventType,
                })),
            } as FullMatch;
        });

        // Combine the fetched team data with the transformed matches.
        return { ...team, matches: fullMatches };

    } catch (error) {
        console.error(`Error al obtener el equipo por slug: ${slug}`, error);
        return null;
    }
}
