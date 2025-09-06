
import { z } from 'zod';

// --- Shared Schemas and Types for Genkit Actions ---

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
