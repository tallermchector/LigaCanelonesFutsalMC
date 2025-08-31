import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FutsalBallIcon } from '@/components/icons';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative py-20 md:py-32 bg-[hsl(var(--background))] text-center overflow-hidden"
      aria-label="Sección principal de Liga Canelones Futsal"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' }} />
      <div className="container relative z-10">
        <FutsalBallIcon 
          className="h-16 w-16 text-primary mx-auto mb-6 animate-bounce-slow" 
          aria-label="Icono de pelota de futsal" 
          role="img"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary animate-fade-in [animation-delay:0.1s]">
          ¡Vive la Pasión del Futsal en Canelones!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 animate-fade-in [animation-delay:0.2s]">
          Sigue todos los partidos, noticias y estadísticas de la liga regional.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in [animation-delay:0.3s]">
          <Button size="lg" asChild>
            <Link href="#news-summary" scroll={true}>Ver Noticias</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent" asChild>
            <Link href="#teams">Explorar Equipos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
