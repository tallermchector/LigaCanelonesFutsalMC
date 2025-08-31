"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ControlMatchCard } from "@/components/controles/ControlMatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Match } from "@/components/controles/ControlMatchCard";

export default function ControlesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("SCHEDULED");

  useEffect(() => {
    setLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setMatches([
        {
          id: "1",
          teamA: { name: "Garra Charrua", logo: "https://picsum.photos/100/100" },
          teamB: { name: "Los Pibes", logo: "https://picsum.photos/100/100" },
          date: "Sábado, 10 Ago - 20:00hs",
          status: "SCHEDULED",
        },
        {
          id: "2",
          teamA: { name: "La Furia", logo: "https://picsum.photos/100/100" },
          teamB: { name: "El Taladro", logo: "https://picsum.photos/100/100" },
          date: "Sábado, 10 Ago - 21:30hs",
          status: "SCHEDULED",
        },
        {
          id: "3",
          teamA: { name: "Toca y Pasa", logo: "https://picsum.photos/100/100" },
          teamB: { name: "Atlas", logo: "https://picsum.photos/100/100" },
          date: "Domingo, 11 Ago - 19:00hs",
          status: "LIVE",
        },
        {
            id: "4",
            teamA: { name: "Leyendas FC", logo: "https://picsum.photos/100/100" },
            teamB: { name: "Resto del Mundo", logo: "https://picsum.photos/100/100" },
            date: "Viernes, 9 Ago - 22:00hs",
            status: "FINISHED",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredMatches = matches.filter((match) => match.status === activeTab);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary mb-6">
        Panel de Control
      </h1>
      <Tabs
        defaultValue="SCHEDULED"
        onValueChange={(value) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="SCHEDULED">Programados</TabsTrigger>
          <TabsTrigger value="LIVE">En Vivo</TabsTrigger>
          <TabsTrigger value="FINISHED">Finalizados</TabsTrigger>
        </TabsList>
        <TabsContent value="SCHEDULED">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredMatches.map((match) => (
                <ControlMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay partidos programados.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="LIVE">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
             {[...Array(1)].map((_, i) => (
               <Skeleton key={i} className="h-64 w-full" />
             ))}
           </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredMatches.map((match) => (
                <ControlMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay partidos en vivo en este momento.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="FINISHED">
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
             {[...Array(1)].map((_, i) => (
               <Skeleton key={i} className="h-64 w-full" />
             ))}
           </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredMatches.map((match) => (
                <ControlMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No hay partidos finalizados recientemente.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
