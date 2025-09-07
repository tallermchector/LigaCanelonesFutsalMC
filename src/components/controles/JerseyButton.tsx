
'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';


interface JerseyButtonProps extends VariantProps<typeof buttonVariants> {
  jerseyNumber: number;
  playerName: string;
  isSelected: boolean;
  isActive: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

export function JerseyButton({ jerseyNumber, playerName, isSelected, isActive, onClick, isDisabled = false, variant }: JerseyButtonProps) {
  
  return (
    <div className="flex flex-col items-center">
      <Button
        variant={variant}
        className={cn(
          'relative h-14 w-14 rounded-full text-lg font-bold flex flex-col items-center justify-center p-0 transition-all duration-200',
           isSelected && variant !== 'destructive' && 'ring-2 ring-offset-2 ring-primary'
        )}
        onClick={onClick}
        disabled={isDisabled}
        aria-label={`Seleccionar jugador ${playerName}, número ${jerseyNumber}`}
        aria-pressed={isSelected}
      >
        {isActive && !isSelected && (
            <ShieldCheck className="absolute top-0 right-0 h-4 w-4 text-green-500 bg-white rounded-full" />
        )}
        <span className="font-bold text-xl">{jerseyNumber}</span>
      </Button>
      <span className={cn(
          "mt-2 text-xs font-medium text-center truncate w-20"
      )}>
        {playerName}
      </span>
    </div>
  );
}
