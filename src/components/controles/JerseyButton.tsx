
'use client';

import { cn } from '@/lib/utils';
import { TshirtIcon } from '@/components/icons';
import { VariantProps, cva } from 'class-variance-authority';

const jerseyVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        'default': "text-gray-600",
        'outline': "text-gray-400",
        'destructive': "text-red-500",
        'accent-blue': "text-blue-500",
        'accent-red': "text-red-500",
      },
      isActive: {
        true: "opacity-100",
        false: "opacity-50 hover:opacity-100"
      }
    },
    defaultVariants: {
      variant: 'default',
      isActive: true,
    },
  }
)

interface JerseyButtonProps extends VariantProps<typeof jerseyVariants> {
  jerseyNumber: number;
  playerName: string;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}


export function JerseyButton({ jerseyNumber, playerName, isSelected, isActive, onClick, isDisabled = false, variant }: JerseyButtonProps) {
  
  return (
    <div 
        className={cn(
            "flex flex-col items-center gap-1 cursor-pointer group",
            isDisabled && "cursor-not-allowed opacity-50"
        )}
        onClick={!isDisabled ? onClick : undefined}
        aria-label={`Seleccionar jugador ${playerName}, número ${jerseyNumber}`}
        aria-pressed={isSelected}
    >
        <div className="relative w-16 h-16 flex items-center justify-center">
            <TshirtIcon className={cn(
                "w-14 h-14 transition-all duration-200 ease-in-out group-hover:scale-110",
                jerseyVariants({ variant, isActive })
            )} />
            <span className={cn(
                "absolute text-white font-bold text-lg select-none transition-all duration-200 ease-in-out group-hover:scale-110",
                "drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
            )}>
                {jerseyNumber}
            </span>
            {isSelected && (
                <div className="absolute inset-0 w-full h-full rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background" />
            )}
        </div>
      <span className={cn(
          "mt-1 text-xs font-semibold text-center truncate w-20 transition-colors",
          isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {playerName}
      </span>
    </div>
  );
}
