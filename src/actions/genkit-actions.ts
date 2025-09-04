
'use server';

import {
  createSeasonAndTeams,
  generateFixtureForSeason,
} from '@/ai/flows/generate-season-flow';
import { z } from 'zod';

// --- Shared Schemas and Types ---

const TeamInputSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const CreateSeasonAndTeamsInputSchema = z.object({
  seasonId: z.number(),
  teams: z.array(TeamInputSchema),
});
export type CreateSeasonAndTeamsInput = z.infer<
  typeof CreateSeasonAndTeamsInputSchema
>;

export const GenerateFixtureForSeasonInputSchema = z.object({
  seasonId: z.number(),
  teams: z.array(TeamInputSchema),
});
export type GenerateFixtureForSeasonInput = z.infer<
  typeof GenerateFixtureForSeasonInputSchema
>;


/**
 * Server action to create a season and associate teams with it.
 * This function is safe to be called from client components.
 * @param input - The season and team data.
 */
export async function createSeasonAndTeamsAction(
  input: CreateSeasonAndTeamsInput
) {
  return await createSeasonAndTeams(input);
}

/**
 * Server action to generate the fixture for a season.
 * This function is safe to be called from client components.
 * @param input - The season and team data for fixture generation.
 * @returns A promise that resolves with the count of matches created.
 */
export async function generateFixtureForSeasonAction(
  input: GenerateFixtureForSeasonInput
) {
  return await generateFixtureForSeason(input);
}
