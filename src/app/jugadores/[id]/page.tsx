
import { getPlayerById } from '@/actions/player-actions';
import { PlayerBasicInfo } from '@/components/jugadores/perfil/PlayerBasicInfo';
import { PlayerHero } from '@/components/jugadores/perfil/PlayerHero';
import { PlayerInfoTabs } from '@/components/jugadores/perfil/PlayerInfoTabs';
import { PlayerStats } from '@/components/jugadores/perfil/PlayerStats';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface PlayerPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function PlayerPage(props: PlayerPageProps) {
    const params = await props.params;
    const playerId = parseInt(params.id, 10);
    if (isNaN(playerId)) {
        notFound();
    }

    const player = await getPlayerById(playerId);

    if (!player) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PlayerHero player={player} />
                <PlayerInfoTabs />

                <div className="bg-muted/40 py-8">
                    <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <PlayerBasicInfo player={player} />
                        <PlayerStats />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
