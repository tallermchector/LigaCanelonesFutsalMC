
'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Player, Team } from '@/types';

interface PlayerHeroProps {
    player: Player & { team: Team };
}

export function PlayerHero({ player }: PlayerHeroProps) {
    const router = useRouter();

    return (
        <header className="relative bg-red-600 text-white">
            {/* Header Bar */}
            <div className="container mx-auto flex h-16 items-center justify-between">
                <button onClick={() => router.back()} className="p-2">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">{player.name}</h1>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Player Info Section */}
            <div className="container mx-auto pb-6 pt-4">
                <div className="relative h-64 text-center">
                    <Image
                        src={'/placeholder-player.png'} // Placeholder image
                        alt={`Foto de ${player.name}`}
                        fill
                        className="object-contain object-bottom"
                    />
                    {/* Background shapes could go here as absolute elements */}
                </div>

                <div className="flex items-end gap-4 mt-4">
                    <span className="text-6xl font-black text-white/50">{player.number}</span>
                    <div>
                        <h2 className="text-3xl font-bold uppercase">{player.name}</h2>
                        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                            <Image
                                src={player.team.logoUrl || ''}
                                alt={`Logo de ${player.team.name}`}
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <span>{player.team.name}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold">{player.position}</p>
                     {player.nationality && (
                        <div className="flex items-center gap-2">
                            {/* Placeholder for flag */}
                            <div className="w-6 h-4 bg-gray-300 rounded-sm" title={`Bandera de ${player.nationality}`} />
                            <span className="font-semibold">{player.nationality}</span>
                        </div>
                     )}
                </div>
            </div>
        </header>
    );
}
