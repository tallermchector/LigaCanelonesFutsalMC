
"use client"

import type { Team } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"
import Image from "next/image"

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.original.logoUrl;
      const name = row.original.name;
      return <Image src={logoUrl || '/logofu.svg'} alt={`Logo de ${name}`} width={32} height={32} className="rounded-full" />
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre del Club" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "players",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jugadores" />
    ),
    cell: ({ row }) => {
      const players = row.original.players;
      return <div className="text-center">{players?.length || 0}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
