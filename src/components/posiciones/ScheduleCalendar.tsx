
'use client';

import type { FullMatch, Team } from '@/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { FutsalBallIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ScheduleCalendarProps {
  matches: FullMatch[];
}

const groupMatchesByRound = (matches: FullMatch[]) => {
  return matches.reduce((acc, match) => {
    const round = match.round || 0;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {} as Record<number, FullMatch[]>);
};

const groupMatchesByDate = (matches: FullMatch[]) => {
  return matches.reduce((acc, match) => {
    const date = new Date(match.scheduledTime);
    const dateString = date.toLocaleDateString('es-UY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
    
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(match);
    return acc;
  }, {} as Record<string, FullMatch[]>);
};


export function ScheduleCalendar({ matches }: ScheduleCalendarProps) {
  const matchesByRound = useMemo(() => groupMatchesByRound(matches), [matches]);
  const rounds = useMemo(() => Object.keys(matchesByRound).map(Number).sort((a, b) => a - b), [matchesByRound]);
  const [selectedRound, setSelectedRound] = useState(rounds.length > 0 ? rounds[0] : null);

  const displayedMatches = selectedRound ? matchesByRound[selectedRound] : [];
  const matchesByDate = groupMatchesByDate(displayedMatches);

  if (rounds.length === 0) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No hay partidos en el calendario.</CardContent></Card>;
  }

  return (
    <div>
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps" }}
        className="w-full max-w-lg mx-auto mb-8"
      >
        <CarouselContent className="-ml-2">
          {rounds.map(round => (
            <CarouselItem key={round} className="pl-2 basis-auto">
              <Button
                variant={selectedRound === round ? 'default' : 'outline'}
                onClick={() => setSelectedRound(round)}
                className="w-full"
              >
                Jornada {round}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      
      <div className="space-y-6">
        {Object.entries(matchesByDate).map(([date, dateMatches]) => (
          <div key={date}>
            <h3 className="bg-muted/50 px-4 py-2 text-sm font-semibold text-center uppercase tracking-wider text-muted-foreground rounded-t-lg">
              {date}
            </h3>
            <div className="divide-y divide-border border-x border-b rounded-b-lg">
              {dateMatches.map(match => (
                <MatchItem key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function MatchItem({ match }: { match: FullMatch }) {
  const { teamA, teamB, scheduledTime } = match;
  const date = new Date(scheduledTime);

  return (
    <div className="p-4 hover:bg-muted/50">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
        <TeamDisplay team={teamA} />
        
        <div>
          <div className="text-xl md:text-3xl font-bold">
            {date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <Link href={`/partidos/${match.id}`} className="text-xs font-semibold text-primary hover:underline mt-1 block">
            VER PREVIA
          </Link>
          <FutsalBallIcon className="w-5 h-5 mx-auto mt-2 text-muted-foreground" />
        </div>
        
        <TeamDisplay team={teamB} />
      </div>
    </div>
  );
}

function TeamDisplay({ team }: { team: Team }) {
  return (
    <Link href={`/clubes/${team.slug}`} className="flex flex-col items-center gap-2 group">
      <Image
        src={team.logoUrl || '/logofu.svg'}
        alt={`Logo de ${team.name}`}
        width={72}
        height={72}
        className="w-14 h-14 md:w-16 md:h-16 aspect-square object-contain transition-transform group-hover:scale-110"
      />
      <span className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary truncate w-full">
        {team.name}
      </span>
    </Link>
  );
}
