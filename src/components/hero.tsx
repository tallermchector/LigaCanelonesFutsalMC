import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[hsl(var(--background))] text-center overflow-hidden"
      aria-label="Sección principal de Liga Canelones Futsal"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' }} />
      <div className="container relative z-10">
        <Image 
          src="/logofu.svg" 
          alt="Liga Futsal Logo"
          width={64}
          height={64}
          className="mx-auto mb-6 animate-bounce-slow" 
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
            <Link href="/partidos">Ver Partidos</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent" asChild>
            <Link href="#teams">Explorar Equipos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
