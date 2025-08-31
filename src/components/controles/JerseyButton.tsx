
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JerseyButtonProps {
  jerseyNumber: number;
  playerName: string;
  isSelected: boolean;
  onClick: () => void;
}

export function JerseyButton({ jerseyNumber, playerName, isSelected, onClick }: JerseyButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant={isSelected ? 'accent' : 'outline'}
        className={cn(
          'h-14 w-14 rounded-full text-lg font-bold flex flex-col items-center justify-center p-0 transition-all duration-200',
          isSelected && 'ring-2 ring-offset-2 ring-accent'
        )}
        onClick={onClick}
        aria-label={`Seleccionar jugador ${playerName}, número ${jerseyNumber}`}
        aria-pressed={isSelected}
      >
        <span className="font-bold text-xl">{jerseyNumber}</span>
      </Button>
      <span className="mt-2 text-xs font-medium text-center truncate w-20">{playerName}</span>
    </div>
  );
}
