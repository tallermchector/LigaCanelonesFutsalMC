
'use client';

import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameProvider';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function ManualEntryActions() {
    const { state, handleSaveChanges } = useGame();
    const { toast } = useToast();
    const router = useRouter();

    const onSave = async () => {
        await handleSaveChanges(state);
        toast({
            title: 'Datos Guardados',
            description: 'El estado actual del partido ha sido guardado exitosamente.',
        });
    }

    return (
        <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/ingreso-manual')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Salir sin Guardar
            </Button>
            <Button onClick={onSave} >
                <Save className="mr-2 h-4 w-4" />
                Guardar Datos del Partido
            </Button>
        </div>
    );
}

