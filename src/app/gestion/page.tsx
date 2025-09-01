
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllMatchesFromDb, getAllTeams } from '@/actions/prisma-actions';
import { MatchDataTable } from '@/components/gestion/DataTable';
import { columns } from '@/components/gestion/Columns';
import { CreateMatchForm } from '@/components/gestion/CreateMatchForm';

export default async function GestionPage() {
    const matches = await getAllMatchesFromDb();
    const teams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Partidos"
                    description="Crea, visualiza y administra todos los partidos de la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <h2 className="text-2xl font-bold text-primary mb-4">Lista de Partidos</h2>
                             <MatchDataTable columns={columns} data={matches} />
                        </div>
                        <div>
                             <h2 className="text-2xl font-bold text-primary mb-4">Crear Nuevo Partido</h2>
                             <CreateMatchForm teams={teams} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
