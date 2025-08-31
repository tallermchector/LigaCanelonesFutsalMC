'use server';
/**
 * @fileOverview A flow that summarizes futsal news articles from a given URL.
 *
 * - summarizeFutsalNews - A function that takes a URL and returns a short summary of the article.
 * - SummarizeFutsalNewsInput - The input type for the summarizeFutsalNews function.
 * - SummarizeFutsalNewsOutput - The return type for the summarizeFutsalNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFutsalNewsInputSchema = z.object({
  url: z.string().url().describe('The URL of the futsal news article to summarize.'),
});
export type SummarizeFutsalNewsInput = z.infer<typeof SummarizeFutsalNewsInputSchema>;

const SummarizeFutsalNewsOutputSchema = z.object({
  summary: z.string().describe('A short summary of the futsal news article.'),
});
export type SummarizeFutsalNewsOutput = z.infer<typeof SummarizeFutsalNewsOutputSchema>;

export async function summarizeFutsalNews(input: SummarizeFutsalNewsInput): Promise<SummarizeFutsalNewsOutput> {
  return summarizeFutsalNewsFlow(input);
}

const summarizeFutsalNewsPrompt = ai.definePrompt({
  name: 'summarizeFutsalNewsPrompt',
  input: {schema: SummarizeFutsalNewsInputSchema},
  output: {schema: SummarizeFutsalNewsOutputSchema},
  prompt: `You are an AI expert in summarizing futsal news articles.

  Please provide a concise summary of the article found at the following URL:
  {{{url}}}
  `,
});

const summarizeFutsalNewsFlow = ai.defineFlow(
  {
    name: 'summarizeFutsalNewsFlow',
    inputSchema: SummarizeFutsalNewsInputSchema,
    outputSchema: SummarizeFutsalNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeFutsalNewsPrompt(input);
    return output!;
  }
);
