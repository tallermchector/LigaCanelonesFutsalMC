"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, BarChart3 } from "lucide-react";
import { PlayerRosterDialog } from "./PlayerRosterDialog";

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export interface Team {
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  date: string;
  status: MatchStatus;
}

interface ControlMatchCardProps {
  match: Match;
}

export function ControlMatchCard({ match }: ControlMatchCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-around p-4 border-b">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={match.teamA.logo}
            alt={match.teamA.name}
            width={60}
            height={60}
            className="rounded-full"
            data-ai-hint="team logo"
          />
          <span className="font-semibold text-center">{match.teamA.name}</span>
        </div>
        <span className="text-2xl font-bold text-muted-foreground">VS</span>
        <div className="flex flex-col items-center gap-2">
          <Image
            src={match.teamB.logo}
            alt={match.teamB.name}
            width={60}
            height={60}
            className="rounded-full"
            data-ai-hint="team logo"
          />
          <span className="font-semibold text-center">{match.teamB.name}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{match.date}</span>
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t">
        {match.status === "SCHEDULED" && (
          <div className="flex w-full gap-2">
            <PlayerRosterDialog match={match} />
            <Button asChild className="flex-1">
              <Link href={`/controles/${match.id}`}>Controlar Partido</Link>
            </Button>
          </div>
        )}
        {match.status === "LIVE" && (
          <Button asChild variant="destructive" className="w-full">
            <Link href={`/controles/${match.id}`}>Controlar Partido (En Vivo)</Link>
          </Button>
        )}
        {match.status === "FINISHED" && (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/partidos/${match.id}/estadisticas`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Estadísticas
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
