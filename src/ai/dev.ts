
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

import '@/ai/flows/summarize-futsal-news.ts';
import './flows/generate-season-flow';
import './flows/generate-blog-post-flow';
