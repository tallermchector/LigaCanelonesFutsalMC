
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Goal, Shield, Square } from 'lucide-react';

export function ManualEventActions() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-wrap justify-center gap-4">
                <Button variant="accent" size="lg">
                    <Goal className="mr-2 h-5 w-5" />
                    Registrar Gol
                </Button>
                 <Button variant="outline">
                    <Shield className="mr-2 h-5 w-5" />
                    Registrar Falta
                </Button>
                <Button variant="outline" className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-600">
                    <Square className="mr-2 h-5 w-5 fill-current" />
                    Tarjeta Amarilla
                </Button>
                <Button variant="destructive">
                    <Square className="mr-2 h-5 w-5 fill-current" />
                    Tarjeta Roja
                </Button>
            </CardContent>
        </Card>
    );
}
