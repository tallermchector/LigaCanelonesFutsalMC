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

interface StandingsTableProps {
  // El tipo debe incluir la relación con el equipo
  standings: (SeasonTeamWithTeam & { team: Team })[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Club</TableHead>
            <TableHead className="text-center">PJ</TableHead>
            <TableHead className="text-center">G</TableHead>
            <TableHead className="text-center">E</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">GF</TableHead>
            <TableHead className="text-center">GC</TableHead>
            <TableHead className="text-center">DG</TableHead>
            <TableHead className="text-center">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((entry, index) => (
            <TableRow key={entry.teamId}>
              <TableCell className="font-bold text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image
                    src={entry.team.logoUrl || '/logofu.svg'}
                    alt={`Logo de ${entry.team.name}`}
                    width={24}
                    height={24}
                    className="aspect-square object-contain"
                  />
                  <span className="font-medium">{entry.team.name}</span>
                </div>
              </TableCell>
              {/* Placeholders para estadísticas */}
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center font-bold">0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
