
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { getAllPlayers } from '@/actions/player-actions';
import { PlayerDataTable } from '@/components/gestion/jugadores/PlayerDataTable';
import { columns } from '@/components/gestion/jugadores/Columns';
import { CreatePlayerForm } from '@/components/gestion/jugadores/CreatePlayerForm';
import { getAllTeams } from '@/actions/team-actions';

export default async function GestionJugadoresPage() {
    const players = await getAllPlayers();
    const teams = await getAllTeams();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Jugadores"
                    description="Administra todos los jugadores de la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <h2 className="text-2xl font-bold text-primary mb-4">Lista de Jugadores</h2>
                             <PlayerDataTable columns={columns} data={players} />
                        </div>
                        <div>
                             <h2 className="text-2xl font-bold text-primary mb-4">Crear Nuevo Jugador</h2>
                             <CreatePlayerForm teams={teams} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
