# AGENTS.md

This file provides instructions for AI agents working on this repository.

## Project Overview

This is a "Futsal Amateur Tournament Management System" built with Next.js, Prisma, and Tailwind CSS. The goal of the project is to provide a comprehensive platform for managing futsal tournaments.

Refer to the `README.md` file for a more detailed project description, feature list, and setup instructions.

## Development Environment

### Setup

1.  **Install dependencies:**
    ```bash
    bun install
    ```
    This will install all the necessary packages defined in `package.json`.

2.  **Prisma Client Generation:**
    The `postinstall` script automatically runs `prisma generate`, so you don't need to run it manually after installation. However, if you make changes to the `prisma/schema.prisma` file, you will need to run it again:
    ```bash
    prisma generate
    ```

### Running the Application

To start the development server, run:
```bash
bun run dev
```
The application will be available at `http://localhost:9002`.

## Database

The project uses Prisma as the ORM to interact with a PostgreSQL database.

*   The database schema is defined in `prisma/schema.prisma`.
*   To apply schema changes to the database, use `prisma db push`.
*   The `prisma/seed.ts` file contains seed data. To seed the database, run `bun run db:seed`.

## Project Structure

*   `src/app/`: Contains the pages and routes of the application (using the Next.js App Router).
*   `src/components/`: Contains reusable React components.
    *   `src/components/ui/`: Contains the base UI components from `shadcn/ui`. Do not modify these directly unless you know what you are doing.
    *   `src/components/landing/`: Components for the landing page.
    *   `src/components/gestion/`: Components for the management dashboard.
    *   ... and so on for other features.
*   `src/lib/`: Contains utility functions and library initializations (e.g., `prisma.ts`).
*   `src/actions/`: Contains server-side actions (e.g., for form submissions).
*   `prisma/`: Contains all database-related files, including the schema, migrations, and seed script.
*   `public/`: Contains static assets like images and fonts.

## Coding Conventions

*   **Follow existing code style.**
*   **Use the UI components from `src/components/ui/` whenever possible.** This ensures a consistent look and feel across the application.
*   **Use server-side actions (`src/actions/`) for data mutations.** This is the recommended way to handle form submissions and other data-modifying operations in Next.js.
*   **Keep components small and focused on a single responsibility.**

## AI Integration

The project uses [Google AI (Genkit)](https://firebase.google.com/docs/genkit) for AI-powered features.
*   The AI-related code is located in the `src/ai/` directory.
*   To run the Genkit development server, use `bun run genkit:dev`.

By following these guidelines, you will help maintain the quality and consistency of the codebase.
