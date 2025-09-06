'use client';

import type { FullMatch, Team } from '@/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from '../ui/badge';

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
        className="w-full max-w-sm sm:max-w-md mx-auto mb-8"
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
      
      <div className="space-y-8">
        {Object.entries(matchesByDate).map(([date, dateMatches]) => (
          <div key={date}>
            <h3 className="bg-gradient-to-r from-primary/10 via-background to-primary/10 px-4 py-2 text-sm font-bold text-center uppercase tracking-widest text-primary border-y border-primary/20">
              {date}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
  const { teamA, teamB, status, scoreA, scoreB, scheduledTime } = match;
  const date = new Date(scheduledTime);

  const renderScoreOrTime = () => {
    switch (status) {
      case 'FINISHED':
        return (
          <div className="text-2xl font-bold tabular-nums flex items-center justify-center gap-x-2">
            <span className={cn(scoreA > scoreB && 'text-green-500')}>{scoreA}</span>
            <span>-</span>
            <span className={cn(scoreB > scoreA && 'text-green-500')}>{scoreB}</span>
          </div>
        );
      case 'LIVE':
        return (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold tabular-nums">{scoreA} - {scoreB}</div>
            <Badge variant="destructive" className="mt-1 animate-pulse">EN VIVO</Badge>
          </div>
        );
      case 'SCHEDULED':
      default:
        return (
          <div className="text-xl font-bold">
            {date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
          </div>
        );
    }
  };

  return (
    <Link href={`/partidos/${match.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary/50 group-hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
            <span>Jornada {match.round}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <TeamDisplay team={teamA} alignment="left" />
            <div className="text-muted-foreground font-bold text-center">
              {renderScoreOrTime()}
            </div>
            <TeamDisplay team={teamB} alignment="right" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TeamDisplay({ team, alignment }: { team: Team, alignment: 'left' | 'right' }) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center gap-2 sm:gap-3",
      alignment === 'right' ? 'sm:flex-row-reverse' : 'sm:flex-row'
    )}>
      <Image
        src={team.logoUrl || '/logofu.svg'}
        alt={`Logo de ${team.name}`}
        width={40}
        height={40}
        className="w-10 h-10 aspect-square object-contain transition-transform group-hover:scale-110"
      />
      <span className={cn(
        "font-bold text-sm text-center sm:text-base text-foreground group-hover:text-primary transition-colors",
        alignment === 'left' ? 'sm:text-left' : 'sm:text-right',
        "truncate"
      )}>
        {team.name}
      </span>
    </div>
  );
}
