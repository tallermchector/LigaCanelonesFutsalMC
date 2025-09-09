# GEMINI.md - Onboarding Guide for AI Assistants

¡Hola! Soy un asistente de IA de Google, listo para ayudarte a construir y mejorar este proyecto. Este documento es mi guía de referencia para entender el proyecto, su arquitectura y las convenciones de código.

## Misión del Proyecto

El objetivo de este proyecto es desarrollar un **Sistema de Gestión de Torneos de Futsal Amateur**. La plataforma debe ser una solución integral que permita a los organizadores gestionar equipos, jugadores, partidos, estadísticas y temporadas de manera eficiente.

## Stack Tecnológico Principal

Este proyecto está construido con un stack moderno de tecnologías de desarrollo web:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Base de Datos:** PostgreSQL
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
-   **Runtime de JavaScript:** [Bun](https://bun.sh/)
-   **Integración de IA:** [Google AI (Genkit)](https://firebase.google.com/docs/genkit)

## Arquitectura de Datos

La gestión de datos se centraliza a través de **Prisma**.

-   **`prisma/schema.prisma`**: Este archivo es la única fuente de verdad para el esquema de la base de datos. Define todos los modelos, sus campos y relaciones. Cualquier cambio en la estructura de datos debe realizarse aquí.
-   **Cliente de Prisma**: Las consultas a la base de datos se realizan a través del cliente de Prisma, que proporciona seguridad de tipos de extremo a extremo.

## Flujo de Desarrollo

Para poner en marcha el entorno de desarrollo, sigue estos pasos:

1.  **Instalar Dependencias:**
    ```bash
    bun install
    ```
2.  **Aplicar Cambios en la Base de Datos:**
    Si has modificado el `schema.prisma`, actualiza la base de datos con:
    ```bash
    prisma db push
    ```
3.  **Poblar la Base de Datos (Opcional):**
    Para llenar la base de datos con datos de prueba, ejecuta:
    ```bash
    bun run db:seed
    ```
4.  **Ejecutar el Servidor de Desarrollo:**
    ```bash
    bun run dev
    ```
    La aplicación estará disponible en `http://localhost:9002`.

## Guía de Estilo y Convenciones de Código

-   **Coherencia:** Sigue siempre el estilo y los patrones del código existente.
-   **Componentes de UI:** Utiliza los componentes de `src/components/ui/` (shadcn/ui) como base para cualquier nuevo elemento de la interfaz.
-   **Mutaciones de Datos:** Implementa toda la lógica de creación, actualización o eliminación de datos a través de **Server Actions**, ubicadas en `src/actions/`.
-   **Modularidad:** Mantén los componentes pequeños y enfocados en una única responsabilidad para facilitar su mantenimiento y reutilización.
-   **Assets:** Los archivos estáticos como imágenes e íconos se encuentran en la carpeta `public/`.
