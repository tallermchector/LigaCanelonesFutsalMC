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
        <header className="relative overflow-hidden bg-primary/5 pt-4 pb-8 md:pt-8 md:pb-12">
            <div className="container mx-auto relative z-10">
                <Button onClick={() => router.back()} variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>

                <div className="grid md:grid-cols-2 items-center gap-8">
                    {/* Player Info */}
                    <div className="relative text-center md:text-left">
                        <span className="absolute -top-10 -left-4 text-[12rem] font-black text-primary/5 select-none opacity-50 z-[-1]">
                            {player.number}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold uppercase text-primary">
                            {player.name}
                        </h1>
                        <p className="text-lg font-semibold text-muted-foreground mt-1">{player.position}</p>
                        
                        <Link href={`/clubes/${player.team.slug}`} className="inline-flex items-center gap-2 mt-4 group">
                            <Image
                                src={player.team.logoUrl || ''}
                                alt={`Logo de ${player.team.name}`}
                                width={28}
                                height={28}
                                className="w-7 h-7 object-contain transition-transform group-hover:scale-110"
                            />
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{player.team.name}</span>
                        </Link>
                    </div>

                    {/* Player Image */}
                    <div className="relative h-80 md:h-96">
                        <Image
                            src={'/placeholder-player.png'}
                            alt={`Foto de ${player.name}`}
                            fill
                            className="object-contain object-bottom drop-shadow-[0_20px_15px_rgba(0,0,0,0.2)]"
                        />
                         <Image
                            src={'/logofu.png'}
                            alt="Logo de la Liga"
                            fill
                            className="object-contain object-center opacity-5 scale-150 z-[-2]"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
