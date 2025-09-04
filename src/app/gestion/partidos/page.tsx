
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import { getAllTeams } from '@/actions/team-actions';
import { MatchDataTable } from '@/components/gestion/partidos/DataTable';
import { columns } from '@/components/gestion/partidos/Columns';
import { CreateMatchForm } from '@/components/gestion/partidos/CreateMatchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GestionPartidosPage() {
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Lista de Partidos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MatchDataTable columns={columns} data={matches} />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Crear Nuevo Partido</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CreateMatchForm teams={teams} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
