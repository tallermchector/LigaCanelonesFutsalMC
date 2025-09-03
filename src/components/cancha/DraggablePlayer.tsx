
'use client';

import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';

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
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: { id },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = Math.round(x + (delta.x / window.innerWidth) * 100);
        const newY = Math.round(y + (delta.y / window.innerHeight) * 100);
        onMove(newX, newY);
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [x, y, id, onMove]);

  return (
    <div
      ref={drag}
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
