
'use client';

import type { Team, SeasonTeam as SeasonTeamWithTeam } from '@prisma/client';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface StandingsTableProps {
  // El tipo debe incluir la relación con el equipo
  standings: (SeasonTeamWithTeam & { team: Team })[];
}

const STAT_COLUMNS = ['PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG'];

const renderTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
        case 'up':
            return <ArrowUp className="h-4 w-4 text-green-500" />;
        case 'down':
            return <ArrowDown className="h-4 w-4 text-red-500" />;
        default:
            return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
        <Card>
            <div className="p-8 text-center text-muted-foreground">
                No hay datos de clasificación disponibles para esta temporada.
            </div>
        </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12 text-center font-bold">#</TableHead>
              <TableHead className="font-bold">Equipo</TableHead>
              <TableHead className="w-16 text-center font-bold text-primary">PTS</TableHead>
              {STAT_COLUMNS.map(col => (
                <TableHead key={col} className="w-12 text-center font-bold">{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((entry, index) => (
              <TableRow key={entry.teamId} className="hover:bg-muted/30">
                <TableCell className="font-bold text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                         {/* Placeholder para el icono de tendencia */}
                        {renderTrendIcon('same')}
                        <span>{entry.position}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={entry.team.logoUrl || '/logofu.svg'}
                      alt={`Logo de ${entry.team.name}`}
                      width={28}
                      height={28}
                      className="aspect-square object-contain"
                    />
                    <span className="font-semibold text-foreground truncate">{entry.team.name}</span>
                  </div>
                </TableCell>
                {/* Placeholders para estadísticas */}
                <TableCell className="text-center font-bold text-lg text-primary tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
                <TableCell className="text-center text-muted-foreground tabular-nums">0</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
