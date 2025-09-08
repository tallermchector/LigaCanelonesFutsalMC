
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';

export default function IngresoManualPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[var(--header-height)]">
        <PageHero
          title="Ingreso Manual de Datos"
          description="Herramientas para el ingreso manual de datos de partidos."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-primary" />
                        <span>Panel de Ingreso Manual</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>
                        Esta sección está en construcción. Aquí encontrarás las herramientas para registrar manualmente 
                        los eventos y resultados de los partidos que no se controlan en tiempo real.
                    </p>
                    
                    <h3>Funcionalidades futuras:</h3>
                    <ul>
                        <li>Selección de partido finalizado.</li>
                        <li>Formulario para ingresar goleadores y asistencias.</li>
                        <li>Formulario para registrar tarjetas y otras incidencias.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
