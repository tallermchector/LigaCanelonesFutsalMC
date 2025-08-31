// SummarizeFutsalNews Flow
'use server';
/**
 * @fileOverview A flow that summarizes a futsal news article from a given URL.
 *
 * - summarizeFutsalNews - A function that summarizes a futsal news article.
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

const prompt = ai.definePrompt({
  name: 'summarizeFutsalNewsPrompt',
  input: {schema: SummarizeFutsalNewsInputSchema},
  output: {schema: SummarizeFutsalNewsOutputSchema},
  prompt: `You are an expert futsal news summarizer.  Summarize the article at the following URL in a concise manner:\n\n{{{url}}}`,  
});

const summarizeFutsalNewsFlow = ai.defineFlow(
  {
    name: 'summarizeFutsalNewsFlow',
    inputSchema: SummarizeFutsalNewsInputSchema,
    outputSchema: SummarizeFutsalNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
