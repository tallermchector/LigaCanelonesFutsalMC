
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';

export default async function GestionTemporadasPage() {

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Temporadas"
                    description="Administra las temporadas de la liga."
                />
                 <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="flex justify-center items-center h-40 text-center text-muted-foreground bg-secondary/50 rounded-lg">
                        <p>El panel de gestión de temporadas estará disponible próximamente.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
