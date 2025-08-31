"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Match } from "./ControlMatchCard";

interface PlayerRosterDialogProps {
  match: Match;
}

export function PlayerRosterDialog({ match }: PlayerRosterDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex-1">
          <Users className="mr-2 h-4 w-4" />
          Convocar Jugadores
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convocar Jugadores</DialogTitle>
          <DialogDescription>
            Selecciona los jugadores convocados para el partido entre{" "}
            {match.teamA.name} y {match.teamB.name}. Los cambios se guardarán
            automáticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-center text-muted-foreground">
                (Aquí se implementará la selección de jugadores)
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
