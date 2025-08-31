import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { NewsSummary } from "@/components/news-summary";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CalendarDays } from "lucide-react";

export default function Home() {
  const matches = [
    {
      title: "Garra Charrua vs. Los Pibes",
      time: "Sábado, 10 Ago - 20:00hs",
      place: "Gimnasio Municipal",
    },
    {
      title: "La Furia vs. El Taladro",
      time: "Sábado, 10 Ago - 21:30hs",
      place: "Gimnasio Municipal",
    },
    {
      title: "Toca y Pasa vs. Atlas",
      time: "Domingo, 11 Ago - 19:00hs",
      place: "Club Social Canelones",
    },
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <NewsSummary />
        <section
          id="partidos"
          className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Próximos Partidos
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
                  Calendario de la Liga
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No te pierdas ningún partido. Consulta las fechas, horarios y
                  lugares de los próximos encuentros.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              {matches.map((match, index) => (
                <Card
                  key={index}
                  className="transform-gpu transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                >
                  <CardHeader>
                    <CardTitle>{match.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{match.place}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
