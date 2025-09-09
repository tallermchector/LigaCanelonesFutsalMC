
'use server';
/**
 * @fileOverview Flow para generar una publicación de blog completa con IA.
 * 
 * - generateBlogPost - Genera título, extracto, contenido y URL de imagen.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('El tema o título inicial para la publicación del blog.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('Un título atractivo y optimizado para SEO para la publicación del blog.'),
  excerpt: z.string().describe('Un extracto o resumen corto (2-3 frases) del contenido del artículo.'),
  content: z.string().describe('El contenido completo del artículo, formateado en Markdown. Debe ser informativo, atractivo y visualmente moderno.'),
  imageUrl: z.string().url().describe('Una URL a una imagen de alta calidad de picsum.photos que sea relevante para el tema. Debe ser de 1200x600px.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: { schema: GenerateBlogPostInputSchema },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `
    Eres un periodista deportivo y diseñador de contenido experto en futsal, especializado en la Liga Canaria de Futsal de Uruguay.
    Tu tarea es escribir una publicación de blog atractiva, informativa y con un diseño moderno usando Markdown.

    Tema: {{{topic}}}

    Instrucciones:
    1.  **Título:** Crea un título que sea pegadizo, relevante y optimizado para SEO.
    2.  **Extracto:** Escribe un resumen corto (2-3 frases) que enganche al lector.
    3.  **Contenido:** Desarrolla el tema en un artículo completo y bien estructurado.
        *   **Estructura Moderna:** Utiliza subtítulos (##), listas con viñetas (*), y citas destacadas (>) para romper el texto y hacerlo más legible y dinámico.
        *   **Tono:** Apasionado, conocedor y profesional.
        *   **Imagen en el Cuerpo:** A mitad del artículo, inserta una imagen relevante para el contenido. Usa el formato de Markdown: ![Descripción de la imagen](URL_de_la_imagen). Debes generar una URL de imagen de https://picsum.photos con un tamaño de 800x400 para esta imagen interna.
    4.  **URL de Imagen de Cabecera:** Genera una URL de una imagen de https://picsum.photos con un tamaño de 1200x600 para la imagen principal del artículo. Esta debe ser diferente a la imagen del cuerpo.
  `,
});


const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('La IA no pudo generar la publicación del blog.');
    }
    return output;
  }
);
