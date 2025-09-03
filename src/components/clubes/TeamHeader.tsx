
'use client';
import type { Team } from '@/types';
import Image from 'next/image';

interface TeamHeaderProps {
    team: Team;
}

export function TeamHeader({ team }: TeamHeaderProps) {
    return (
        <div className="bg-primary text-primary-foreground pt-12 pb-28">
            <div className="container mx-auto flex items-center gap-6">
                <Image
                    src={team.logoUrl || '/logofu.svg'}
                    alt={`Logo de ${team.name}`}
                    width={80}
                    height={80}
                    className="aspect-square object-contain bg-white/20 rounded-full p-2"
                />
                <div>
                    <h1 className="text-4xl font-bold">{team.name}</h1>
                </div>
            </div>
        </div>
    );
}
