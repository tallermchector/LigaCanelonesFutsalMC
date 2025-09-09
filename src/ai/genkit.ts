
import { genkit } from 'genkit';

/**
 * Este es el objeto `ai` seguro para ser importado
 * por los flujos que se usan dentro de la aplicación Next.js.
 * No contiene inicialización de plugins para evitar conflictos de compilación.
 */
export const ai = genkit();
