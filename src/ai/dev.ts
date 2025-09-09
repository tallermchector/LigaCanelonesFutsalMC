
'use server';
import { config } from 'dotenv';
config();
// Importar los flujos para que el servidor de desarrollo de Genkit los reconozca.
import '@/ai/flows/summarize-futsal-news.ts';
import '@/ai/flows/generate-season-flow';
import '@/ai/flows/generate-blog-post-flow';
