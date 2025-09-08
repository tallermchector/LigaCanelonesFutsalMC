
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface IngresoManualPartidoPageProps {
    params: {
        id: string;
    };
}

export default async function IngresoManualPartidoPage({ params }: IngresoManualPartidoPageProps) {
    const matchId = params.id;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title={`Ingreso Manual: Partido #${matchId}`}
                    description="Registra los resultados y eventos clave del partido una vez finalizado."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                     <div className="max-w-4xl mx-auto">
                        <Button asChild variant="outline" className="mb-8">
                            <Link href="/ingreso-manual">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a la selección de partidos
                            </Link>
                        </Button>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PenSquare className="h-5 w-5 text-primary" />
                                    <span>Panel de Ingreso</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-none">
                                <p>
                                    Esta sección está en construcción. Aquí podrás registrar el resultado final, 
                                    goleadores, asistencias, tarjetas y otras incidencias del partido con ID: <strong>{matchId}</strong>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
