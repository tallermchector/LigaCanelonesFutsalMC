
'use client';

import type { SocialLink } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface SocialCardProps {
  link: SocialLink;
}

export function SocialCard({ link }: SocialCardProps) {
  const Icon = link.icon;

  return (
    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <Card className="relative flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 bg-card isolate">
        <Image 
            src={link.imageUrl}
            alt={`Fondo para ${link.name}`}
            fill
            className="object-cover -z-10 transition-transform duration-300 group-hover:scale-110"
            data-ai-hint="social media abstract"
        />
        <div className="absolute inset-0 bg-black/60 -z-10"></div>

        <CardContent className="relative z-10 flex flex-col flex-grow items-center justify-center p-6 text-white">
            {Icon && <Icon className="w-12 h-12 mb-4" />}
            <h3 className="text-xl font-bold">{link.name}</h3>
            <div className="mt-2 inline-flex items-center text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Visitar <ArrowUpRight className="ml-1 h-4 w-4" />
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}

