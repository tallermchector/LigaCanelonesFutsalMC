
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import LiveClock from 'react-live-clock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClockPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 py-8 md:p-8 pt-[var(--header-height)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-primary">Página de Reloj de Prueba</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <p className="text-muted-foreground text-center">Este es un reloj en vivo para pruebas, mostrando la hora actual.</p>
                        <div className="text-6xl font-mono font-bold text-foreground bg-card p-4 rounded-lg border">
                            <LiveClock format="HH:mm:ss" ticking={true} />
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
