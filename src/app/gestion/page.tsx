import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CalendarDays, Shield, Users, Trophy, ListChecks } from 'lucide-react';
import prisma from '@/lib/prisma';
import { type Season } from '@prisma/client';

export default async function GestionLigaPage() {

    const managementModules = [
        {
            title: 'Gestión de Calendario',
            description: 'Crea, edita y visualiza los partidos de cada jornada.',
            href: `/gestion/partidos`,
            icon: CalendarDays,
        },
        {
            title: 'Gestión de Equipos',
            description: 'Administra los clubes, sus plantillas y su información.',
            href: '/gestion/clubes',
            icon: Shield,
        },
        {
            title: 'Gestión de Jugadores',
            description: 'Añade, edita y gestiona los perfiles de todos los jugadores.',
            href: '/gestion/jugadores',
            icon: Users,
        },
        {
            title: 'Gestión de Temporadas',
            description: 'Configura las temporadas, participantes y tablas de posiciones.',
            href: '/gestion/temporadas',
            icon: Trophy,
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-left mb-12">
                            <ListChecks className="h-12 w-12 text-primary" />
                            <h1 className="text-4xl font-bold font-orbitron mt-4">Panel de Gestión</h1>
                            <p className="text-muted-foreground mt-2">Selecciona un módulo para empezar a administrar la competición.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {managementModules.map((module) => (
                                <Link href={module.href} key={module.title} className="group">
                                    <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <module.icon className="h-8 w-8 text-primary" />
                                            <div>
                                                <CardTitle>{module.title}</CardTitle>
                                                <CardDescription>{module.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
