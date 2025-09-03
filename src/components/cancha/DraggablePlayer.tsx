
'use client';

import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameProvider';

const ItemTypes = {
  PLAYER: 'player',
};

interface DraggablePlayerProps {
  id: number;
  number: number;
  x: number;
  y: number;
  color: 'blue' | 'red';
  onMove: (x: number, y: number) => void;
}

export function DraggablePlayer({ id, number, x, y, color, onMove }: DraggablePlayerProps) {
  const { dispatch } = useGame();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { id },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        // Calculate new position based on percentage of the container
        const newX = Math.round(x + (delta.x / (monitor.getSourceClientOffset()?.x * 2 / x)) * 100);
        const newY = Math.round(y + (delta.y / (monitor.getSourceClientOffset()?.y * 2 / y)) * 100);
        onMove(newX, newY);
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [x, y, id, onMove]);

  const handleClick = () => {
    // Placeholder for opening an action menu in a future step
    console.log(`Player ${number} clicked`);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={cn(
        'absolute flex h-10 w-10 cursor-move items-center justify-center rounded-full border-2 border-white/50 font-bold text-white shadow-lg',
        color === 'blue' ? 'bg-blue-500' : 'bg-red-500',
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {number}
    </div>
  );
}
