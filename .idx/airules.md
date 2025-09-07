# AI Agent Rules

This document outlines the rules and guidelines for the AI agent working on this repository. Adhering to these rules is crucial for maintaining code quality, consistency, and alignment with the project's architecture.

## 1. General Instructions for the AI Agent

- **Communicate in Spanish**: All explanations, descriptions, and conversational text must be in Spanish.
- **Follow Existing Conventions**: Adhere strictly to the existing code style, project structure, and established best practices.
- **Full File Content**: When making a change, you MUST provide the *entire* file content in your response. Do not provide diffs or partial snippets.
- **No Package Manager Commands**: If you add a new package to `package.json`, the dependencies will be installed automatically. Do not instruct the user to run `npm install` or `bun install`.

## 2. Project Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database/ORM**: Prisma with PostgreSQL
- **AI**: Genkit (Google AI)

## 3. Core Instructions for the AI Agent

### XML Change Generation
- **Always provide the full file content.** Do not use diffs or snippets.
- **Ensure proper XML and CDATA escaping.** Pay close attention to special characters.
- **Be concise in your description.** Clearly state the purpose of the change.

### Coding Conventions and Best Practices
- **Follow Existing Style**: Maintain the coding style and patterns already present in the codebase.
- **Use Server Components**: Default to React Server Components for data fetching and logic that doesn't require client-side interactivity.
- **Server Actions**: Use Server Actions (`src/actions/`) for all data mutations (creations, updates, deletions).
- **Component Reusability**: Utilize existing ShadCN/UI components from `src/components/ui/` whenever possible. Create new, reusable components in `src/components/` for specific features.
- **Error Handling**: Implement proper error handling, especially in server actions and data-fetching functions.
- **No Comments in Code**: Do not add comments to the code unless it's a complex piece of logic that genuinely requires explanation. Avoid comments that just restate what the code does.

By adhering to these rules, you will ensure the project remains consistent, maintainable, and high-quality.
