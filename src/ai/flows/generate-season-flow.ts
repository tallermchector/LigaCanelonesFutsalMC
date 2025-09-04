
'use server';
/**
 * @fileOverview Flow para generar una temporada completa, incluyendo equipos y fixture.
 * 
 * - generateSeason - Crea una temporada, asocia equipos y genera el calendario de partidos.
 */

import { ai } from '@/ai/genkit';
import { prisma } from '@/lib/prisma';
import { generateFixture } from '@/actions/match-actions';
import { z } from 'zod';
import type { Team } from '@prisma/client';


const TeamInputSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// --- Flow to create season and teams ---

const CreateSeasonAndTeamsInputSchema = z.object({
    seasonId: z.number(),
    teams: z.array(TeamInputSchema),
});
type CreateSeasonAndTeamsInput = z.infer<typeof CreateSeasonAndTeamsInputSchema>;

export async function createSeasonAndTeams(input: CreateSeasonAndTeamsInput) {
    return createSeasonAndTeamsFlow(input);
}

const createSeasonAndTeamsFlow = ai.defineFlow(
    {
        name: 'createSeasonAndTeamsFlow',
        inputSchema: CreateSeasonAndTeamsInputSchema,
        outputSchema: z.void(),
    },
    async (input) => {
        await prisma.seasonTeam.createMany({
            data: input.teams.map((team, index) => ({
                seasonId: input.seasonId,
                teamId: team.id,
                position: index + 1, 
            })),
            skipDuplicates: true,
        });
    }
);


// --- Flow to generate fixture for an existing season ---

const GenerateFixtureForSeasonInputSchema = z.object({
  seasonId: z.number(),
  teams: z.array(TeamInputSchema),
});

type GenerateFixtureForSeasonInput = z.infer<typeof GenerateFixtureForSeasonInputSchema>;

export async function generateFixtureForSeason(input: GenerateFixtureForSeasonInput) {
  return generateFixtureForSeasonFlow(input);
}

const generateFixtureForSeasonFlow = ai.defineFlow(
  {
    name: 'generateFixtureForSeasonFlow',
    inputSchema: GenerateFixtureForSeasonInputSchema,
    outputSchema: z.object({ matchCount: z.number() }),
  },
  async (input) => {
    const matches = await generateFixture(input.seasonId, input.teams.map(t => t.id));
    return {
      matchCount: matches.length,
    };
  }
);
