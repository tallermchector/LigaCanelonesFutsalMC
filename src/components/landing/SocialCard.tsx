
'use client';

import type { SocialLink } from '@/types';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SocialCardProps {
  link: SocialLink;
}

export function SocialCard({ link }: SocialCardProps) {
  const Icon = link.icon;
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const encodedSvg = window.btoa(link.background);
      setBackgroundUrl(`data:image/svg+xml;base64,${encodedSvg}`);
    }
  }, [link.background]);


  return (
    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="block group h-full">
      <Card 
        className="relative flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20 bg-card isolate"
        style={{ backgroundImage: `url("${backgroundUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
        <div 
          className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors -z-10"
        ></div>

        <CardContent className={cn(
          "relative z-10 flex flex-col flex-grow items-center justify-center p-6 transition-colors",
          link.textColor ? link.textColor : 'text-white'
        )}>
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
