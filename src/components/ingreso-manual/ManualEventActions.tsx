'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Goal, Shield, Square, Hand, Target, RefreshCw, Timer } from 'lucide-react';

export function ManualEventActions() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-wrap justify-center gap-4">
                <Button variant="accent" size="lg">
                    <Goal className="mr-2 h-5 w-5" />
                    Gol
                </Button>
                 <Button variant="outline">
                    <Hand className="mr-2 h-5 w-5" />
                    Asistencia
                </Button>
                <Button variant="outline">
                    <Target className="mr-2 h-5 w-5" />
                    Tiro
                </Button>
                 <Button variant="outline">
                    <Shield className="mr-2 h-5 w-5" />
                    Falta
                </Button>
                <Button variant="outline" className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-600">
                    <Square className="mr-2 h-5 w-5 fill-current" />
                    Amarilla
                </Button>
                <Button variant="destructive">
                    <Square className="mr-2 h-5 w-5 fill-current" />
                    Roja
                </Button>
                 <Button variant="outline">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Cambio
                </Button>
                 <Button variant="outline">
                    <Timer className="mr-2 h-5 w-5" />
                    T. Muerto
                </Button>
            </CardContent>
        </Card>
    );
}
