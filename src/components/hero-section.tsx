import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Partido de Futsal"
        data-ai-hint="futsal game"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center text-white">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-foreground drop-shadow-md md:text-6xl">
          La Pasión del Futsal en Canelones
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90 drop-shadow-sm md:text-xl">
          Sigue los resultados, noticias y todo lo que acontece en la liga de
          futsal más emocionante.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="transform-gpu transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Link href="#partidos">Ver Partidos</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="transform-gpu border-primary-foreground bg-transparent text-primary-foreground transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-primary-foreground hover:text-primary"
          >
            <Link href="#noticias">Últimas Noticias</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
