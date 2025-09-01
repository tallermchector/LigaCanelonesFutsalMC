
'use client';

import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LiveMatchCard } from './LiveMatchCard';
import type { FullMatch } from '@/types';
import { getLiveMatches } from '@/actions/match-actions';
import { Skeleton } from '../ui/skeleton';


function LiveMatchesSkeleton() {
    return (
        <div className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto">
            <div className="flex space-x-4">
                 <Skeleton className="h-40 w-full md:w-1/2 lg:w-1/3 rounded-lg" />
                 <Skeleton className="h-40 w-full hidden md:block md:w-1/2 lg:w-1/3 rounded-lg" />
                 <Skeleton className="h-40 w-full hidden lg:block lg:w-1/3 rounded-lg" />
            </div>
        </div>
    )
}

export function LiveMatchesBanner() {
  const [liveMatches, setLiveMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveMatches().then(matches => {
        setLiveMatches(matches);
        setLoading(false);
    });
  }, []);

  return (
    <section id="live-matches" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Sigue la Acción en Vivo</h2>
        {loading ? <LiveMatchesSkeleton /> : liveMatches.length > 0 ? (
        <Carousel 
          className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {liveMatches.map((match) => (
              <CarouselItem key={match.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <LiveMatchCard match={match} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        ) : null}
      </div>
    </section>
  );
}
