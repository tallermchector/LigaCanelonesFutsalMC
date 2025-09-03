
import { getPlayerById } from '@/actions/player-actions';
import { PlayerBasicInfo } from '@/components/jugadores/perfil/PlayerBasicInfo';
import { PlayerHero } from '@/components/jugadores/perfil/PlayerHero';
import { PlayerInfoTabs } from '@/components/jugadores/perfil/PlayerInfoTabs';
import { PlayerStats } from '@/components/jugadores/perfil/PlayerStats';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
    params: {
        id: string;
    }
}

export default async function PlayerPage(props: PlayerPageProps) {
    const { params } = props;
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
            <main className="flex-1">
                <PlayerHero player={player} />
                <PlayerInfoTabs />

                <div className="bg-gray-100 dark:bg-gray-900 py-6">
                    <div className="container mx-auto space-y-6">
                        <PlayerBasicInfo player={player} />
                        <PlayerStats />
                    </div>
                </div>
            </main>
        </div>
    );
}
