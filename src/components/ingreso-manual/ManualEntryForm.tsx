
'use client';

import type { FullMatch } from '@/types';

interface ManualEntryFormProps {
  match: FullMatch;
}

export function ManualEntryForm({ match }: ManualEntryFormProps) {
    // El contenido del formulario será reconstruido aquí.
    return (
        <div>
            <p className="text-center text-muted-foreground p-8">
                Formulario de ingreso manual en construcción.
            </p>
        </div>
    );
}
