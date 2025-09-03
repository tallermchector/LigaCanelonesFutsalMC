
"use client"

import type { Player, Team } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import Image from "next/image"

type PlayerWithTeam = Player & { team: Team };

export const columns: ColumnDef<PlayerWithTeam>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del Jugador" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipo" />
    ),
    cell: ({ row }) => {
      const team = row.original.team;
      return (
        <div className="flex items-center gap-2">
            <Image src={team.logoUrl || '/logofu.svg'} alt={`Logo de ${team.name}`} width={24} height={24} className="rounded-full" />
            <span>{team.name}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
        return value.includes(row.original.team.id);
    },
  },
   {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posición" />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("position")}</div>
    },
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    cell: ({ row }) => {
      return <div className="text-center font-bold">{row.getValue("number")}</div>
    },
  },
]
