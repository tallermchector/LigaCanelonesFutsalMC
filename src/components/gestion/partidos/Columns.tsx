
"use client"

import type { FullMatch } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"
import Image from "next/image"

const statusVariantMap: Record<FullMatch['status'], 'default' | 'destructive' | 'secondary'> = {
  SCHEDULED: 'secondary',
  LIVE: 'destructive',
  FINISHED: 'default',
  SELECTING_STARTERS: 'secondary'
};

export const columns: ColumnDef<FullMatch>[] = [
  {
    accessorKey: "teamA",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipos" />
    ),
    cell: ({ row }) => {
      const teamA = row.original.teamA;
      const teamB = row.original.teamB;
      return (
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2 font-medium">
                <Image src={teamA.logoUrl || '/logofu.svg'} alt={teamA.name} width={24} height={24} className="rounded-full" />
                <span>{teamA.name}</span>
            </div>
            <span className="text-muted-foreground text-xs md:text-sm px-1">vs</span>
             <div className="flex items-center gap-2 font-medium">
                <Image src={teamB.logoUrl || '/logofu.svg'} alt={teamB.name} width={24} height={24} className="rounded-full" />
                <span>{teamB.name}</span>
            </div>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "scheduledTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("scheduledTime"));
      const formatted = date.toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' });
      return <div className="text-muted-foreground">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as FullMatch['status'];
      const statusTextMap: Record<FullMatch['status'], string> = {
          SCHEDULED: 'Programado',
          LIVE: 'En Vivo',
          FINISHED: 'Finalizado',
          SELECTING_STARTERS: 'Def. Titulares'
      };
      return (
        <Badge variant={statusVariantMap[status]}>
            {statusTextMap[status]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
