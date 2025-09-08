
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function ManualPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Manual de Usuario"
          description="Guía y documentación para utilizar la plataforma de gestión."
          icon={true}
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>Bienvenido al Manual</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>
                        Esta sección está diseñada para ayudarte a navegar y utilizar todas las herramientas que ofrece la plataforma de la Liga Canelones Futsal.
                    </p>
                    <p>
                        Aquí encontrarás tutoriales paso a paso, explicaciones de funcionalidades y consejos para sacar el máximo provecho a la gestión de tu equipo y de la liga.
                    </p>
                    
                    <h3>Próximos pasos:</h3>
                    <ul>
                        <li>Cómo gestionar los partidos.</li>
                        <li>Cómo administrar los equipos y jugadores.</li>
                        <li>Cómo utilizar la pizarra táctica.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
