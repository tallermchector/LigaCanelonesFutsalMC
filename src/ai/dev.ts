
'use server';
import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Toda la configuración de Genkit ahora vive aquí.
// Este archivo solo se usa para el servidor de desarrollo de Genkit.
export const ai = genkit({
  plugins: [googleAI({
    apiVersion: "v1beta"
  })],
});

// Importar los flujos para que el servidor de desarrollo de Genkit los reconozca.
import '@/ai/flows/summarize-futsal-news.ts';
import './flows/generate-season-flow';
import './flows/generate-blog-post-flow';
