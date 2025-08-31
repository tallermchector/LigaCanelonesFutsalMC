import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/hero';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header />
      <main className="flex-1">
        <Hero />
        <LiveMatchesBanner />
        <section id="teams" className="py-20 text-center">
          <h2 className="text-3xl font-bold">Equipos</h2>
          <p className="text-muted-foreground mt-2">Próximamente...</p>
        </section>
        <section id="results" className="py-20 text-center bg-secondary">
          <h2 className="text-3xl font-bold">Resultados</h2>
          <p className="text-muted-foreground mt-2">Próximamente...</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
