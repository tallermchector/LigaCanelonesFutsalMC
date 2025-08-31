import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/hero';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { FinishedMatches } from '@/components/landing/FinishedMatches';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]\">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <Hero />
        <LiveMatchesBanner />
        <section id="teams" className="py-20 text-center">
          <h2 className="text-3xl font-bold">Equipos</h2>
          <p className="text-muted-foreground mt-2\">Próximamente...</p>
        </section>
        <FinishedMatches />
         <section id="news" className="py-20 text-center bg-secondary">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Últimas Noticias</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto\">Enterate de las últimas novedades de la liga.</p>
                <div className="mt-8">
                    <Button asChild>
                        <Link href="/blog\">Ver todas las noticias</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
