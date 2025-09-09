# Paso 1: Resolver el error "A "use server" file can only export async functions, found object."

## Problema Detectado
El error indica que el archivo `src/ai/genkit.ts`, marcado con `'use server'`, está exportando un objeto (`export const ai = genkit();`) en lugar de una función asíncrona. Next.js requiere que todos los exports de un archivo "use server" sean funciones asíncronas para que puedan ser invocados como Server Actions.

## Análisis del Contexto
El archivo `src/ai/genkit.ts` parece estar diseñado para exportar una instancia de `genkit` para ser utilizada en flujos de Genkit dentro de la aplicación. El comentario en el archivo sugiere que este `ai` es un "objeto seguro para ser importado por los flujos".

La traza del error menciona `src/ai/flows/generate-blog-post-flow.ts` como el lugar donde se produce el problema al importar `src/ai/genkit.ts`. Esto sugiere que `generate-blog-post-flow.ts` también es un archivo "use server" y que la importación del objeto `ai` es lo que causa el conflicto.

## Solución Propuesta

La solución es eliminar la directiva `'use server'` de `src/ai/genkit.ts`. Este archivo no necesita ser una Server Action, ya que está exportando una instancia de `genkit` para ser utilizada internamente por otros flujos o módulos, no para ser invocada directamente desde el cliente.

## Código a Modificar

```typescript
// src/ai/genkit.ts
// ANTES
'use server';
import { genkit } from 'genkit';

/**
 * Este es el objeto `ai` seguro para ser importado
 * por los flujos que se usan dentro de la aplicación Next.js.
 * No contiene inicialización de plugins para evitar conflictos de compilación.
 */
export const ai = genkit();

// DESPUÉS
import { genkit } from 'genkit';

/**
 * Este es el objeto `ai` seguro para ser importado
 * por los flujos que se usan dentro de la aplicación Next.js.
 * No contiene inicialización de plugins para evitar conflictos de compilación.
 */
export const ai = genkit();
```

## Justificación
Al remover `'use server'`, `src/ai/genkit.ts` deja de ser tratado como un Server Action. Esto permite que exporte un objeto (`ai`) sin violar las reglas de Next.js. Los archivos que importen `ai` de `src/ai/genkit.ts` y que sean Server Actions seguirán funcionando correctamente, ya que el problema estaba en la exportación del propio `genkit.ts`.

## Próximo Paso
Una vez aplicado el cambio, se deberá ejecutar `npm run build` o `next dev` para verificar que el error haya sido resuelto.
