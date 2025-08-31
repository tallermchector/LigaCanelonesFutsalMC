import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { FinishedMatches } from '@/components/landing/FinishedMatches';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="La Pasión del Futsal en Canelones"
          description="Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los amantes del fútbol sala en la región."
        >
          <Button asChild size="lg">
            <Link href="/partidos">Ver Partidos</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
            <Link href="#">Tabla de Posiciones</Link>
          </Button>
        </PageHero>
        <LiveMatchesBanner />
        <section id="teams" className="py-20 text-center">
          <h2 className="text-3xl font-bold">Equipos</h2>
          <p className="text-muted-foreground mt-2">Próximamente...</p>
        </section>
        <FinishedMatches />
         <section id="news" className="py-20 text-center bg-secondary">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Últimas Noticias</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Enterate de las últimas novedades de la liga.</p>
                <div className="mt-8">
                    <Button asChild>
                        <Link href="/blog">Ver todas las noticias</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
