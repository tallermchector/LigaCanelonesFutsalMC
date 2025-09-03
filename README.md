# Futsal Amateur Tournament Management System

This project is a comprehensive management system for amateur futsal tournaments. It provides a platform for tournament organizers, players, and fans to follow matches in real-time, view detailed statistics, and stay up-to-date with the latest news.

## Key Features

*   **Real-Time Match Updates:** Track live scores, goals, assists, and disciplinary actions (yellow and red cards) as they happen.
*   **Detailed Statistics:** Access comprehensive statistics for both players and teams, including goals scored, assists, matches played, and more.
*   **Interactive Tactical Board:** A tool for coaches and players to plan strategies, visualize formations, and analyze plays.
*   **Blog and News Section:** Keep up with the latest tournament news, announcements, and match summaries.
*   **Responsive Design:** The application is fully responsive and accessible on desktops, tablets, and mobile devices.
*   **Match Management:** Easily create, update, and manage matches and teams.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [Prisma](https://www.prisma.io/) with PostgreSQL
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
*   **State Management:** React Context API
*   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **AI:** [Google AI (Genkit)](https://firebase.google.com/docs/genkit)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Bun](https://bun.sh/) (as a package manager)
*   A PostgreSQL database

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables.

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
    Replace the placeholder values with your actual database connection details.

4.  **Apply database migrations:**
    ```bash
    prisma db push
    ```

5.  **Seed the database with initial data (optional):**
    ```bash
    bun run db:seed
    ```

6.  **Run the development server:**
    ```bash
    bun run dev
    ```

    The application should now be running at [http://localhost:9002](http://localhost:9002).
