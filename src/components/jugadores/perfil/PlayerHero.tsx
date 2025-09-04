
'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Player, Team } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlayerHeroProps {
    player: Player & { team: Team };
}

export function PlayerHero({ player }: PlayerHeroProps) {
    const router = useRouter();

    return (
        <header className="relative bg-gray-900 overflow-hidden">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url('/banner_youtube.jpg')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

            <div className="absolute inset-x-0 top-0 z-20 h-16 flex items-center text-white">
                 <div className="container mx-auto flex items-center justify-between">
                     <Button onClick={() => router.back()} variant="ghost" size="icon" className="hover:bg-white/10">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-lg font-bold">{player.name}</h1>
                    <div className="w-10"></div>
                 </div>
            </div>
            
            <div className="container mx-auto pt-24 pb-8 relative z-10">
                <div className="relative h-80 md:h-96 w-full max-w-sm mx-auto">
                    <Image
                        src={'/avatar/3.png'}
                        alt={`Foto de ${player.name}`}
                        fill
                        className="object-contain object-bottom drop-shadow-[0_20px_15px_rgba(0,0,0,0.2)]"
                    />
                </div>
                
                 <div className="mt-4 text-center md:text-left text-white">
                    <div className="flex items-end gap-4">
                        <span className="text-5xl font-bold text-white/20">{player.number}</span>
                        <h2 className="text-4xl font-extrabold uppercase">{player.name}</h2>
                    </div>

                     <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Link href={`/clubes/${player.team.slug}`} className="inline-flex items-center gap-2 group justify-center md:justify-start">
                            <Image
                                src={player.team.logoUrl || ''}
                                alt={`Logo de ${player.team.name}`}
                                width={28}
                                height={28}
                                className="w-7 h-7 object-contain transition-transform group-hover:scale-110 bg-white/20 rounded-full p-1"
                            />
                            <span className="font-bold text-white/90 group-hover:text-primary transition-colors">{player.team.name}</span>
                        </Link>

                        <div className="flex items-center justify-center md:justify-end gap-4">
                            <span className="font-semibold">{player.position}</span>
                            <div className="flex items-center gap-2">
                                <Image src="/bandera_uruguay.svg" alt="Bandera de Uruguay" width={24} height={16} />
                                <span className="font-semibold text-white/80">{player.nationality}</span>
                            </div>
                        </div>
                     </div>
                 </div>
            </div>
        </header>
    );
}
