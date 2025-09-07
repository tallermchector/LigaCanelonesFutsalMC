# AI Agent Development Guidelines for Futsal Tournament System

This document provides a comprehensive set of rules and best practices for any AI agent contributing to this project. Adherence to these guidelines is mandatory to ensure code quality, consistency, and architectural integrity.

## 1. Project Overview

This is a "Futsal Amateur Tournament Management System" built with Next.js, Prisma, and Tailwind CSS. The primary objective is to provide a comprehensive, real-time platform for managing and following amateur futsal tournaments. Key features include live match tracking, detailed statistics, and team/player management.

## 2. Core Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN/UI components
- **ORM**: Prisma with a PostgreSQL database
- **AI**: Genkit (Google AI)

## 3. General Workflow & Interaction Model

- **Clarification is Key**: Before implementing, if a request is ambiguous, ask clarifying questions to fully understand the user's intent.
- **Iterative Development**: Propose changes in logical, manageable chunks. Acknowledge that the first implementation may require further refinement based on user feedback.
- **Explain the "Why"**: Briefly justify significant architectural decisions or the introduction of new components to provide context and share knowledge.

## 4. File Modification Protocol

All file modifications **must** be submitted using the specified XML format.

- **Provide Full File Content**: Never provide partial snippets or diffs. The `<content>` tag must contain the complete, final version of the file.
- **Accurate Descriptions**: The `<description>` tag must offer a concise, high-level summary of the changes being made across all files.
- **No Package Manager Commands**: Do not instruct the user to run `npm install` or `bun install`. Dependency changes in `package.json` are handled automatically.

## 5. Next.js and React Guidelines

- **Server-First Approach**: Default to React Server Components for data fetching and logic that does not require client-side interactivity. Use Client Components (`'use client'`) only when necessary (e.g., for hooks like `useState`, `useEffect`).
- **Server Actions for Mutations**: All database writes (CRUD operations) must be handled through Server Actions located in `src/actions/`. Avoid creating separate API routes for this purpose.
- **Component Architecture**:
  - Leverage existing ShadCN/UI components from `src/components/ui/` to maintain UI consistency.
  - Create new, specialized, and reusable components inside `src/components/`, organized by feature (e.g., `src/components/partidos`, `src/components/gestion`).
  - Keep components focused on a single responsibility.

## 6. Styling (Tailwind CSS & ShadCN/UI)

- **Thematic Colors Only**: **Never use hardcoded colors** (e.g., `bg-red-500`, `text-blue-700`). All colors must be applied using the semantic theme variables defined in `src/app/globals.css` (e.g., `bg-primary`, `text-destructive`, `border-border`). This is non-negotiable and critical for maintaining brand consistency and theme adaptability.
- **Utility-First**: Use Tailwind CSS utility classes for all layout, spacing, and styling needs.
- **Responsiveness**: All components and pages must be fully responsive, providing an optimal experience on mobile, tablet, and desktop viewports.

## 7. Database (Prisma)

- **Schema is the Source of Truth**: The database schema is defined in `prisma/schema.prisma`. All data models and relations are dictated by this file.
- **Prisma Client**: All database interactions must be performed through the singleton Prisma Client instance exported from `src/lib/prisma.ts`. Do not initialize new clients elsewhere.
- **Data Seeding**: The `prisma/seed.ts` file is used for populating the database with initial data. It should be maintained to reflect the current schema.

## 8. AI Integration (Genkit)

- **Centralized Flows**: All AI-powered features must be implemented as Genkit flows within the `src/ai/flows/` directory.
- **Strict Typing**: Define explicit input and output schemas for all flows using `zod` to ensure type safety and predictability. These schemas should be located in `src/types/genkit-types.ts`.
- **Invocation from Server Actions**: Genkit flows should be invoked from wrapper functions within `src/actions/`, which can then be safely called from client-side components. This maintains a clear separation between client-side requests and server-side AI execution.
