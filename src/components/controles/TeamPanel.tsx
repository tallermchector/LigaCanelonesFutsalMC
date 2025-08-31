'use client';

import { useGame } from '@/contexts/GameProvider';
import type { Team } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Goal, Shield, Whistle, Timer } from 'lucide-react';

interface StatCounterProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  icon: React.ReactNode;
}

function StatCounter({ label, value, onIncrement, onDecrement, icon }: StatCounterProps) {
  return (
    <div className="flex flex-col items-center gap-2">
        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            {icon}
            <span>{label}</span>
        </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onDecrement}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-bold w-8 text-center">{value}</span>
        <Button variant="outline" size="icon" onClick={onIncrement}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


interface TeamPanelProps {
  teamId: 'A' | 'B';
}

export function TeamPanel({ teamId }: TeamPanelProps) {
  const { state, dispatch } = useGame();
  
  const team = teamId === 'A' ? state.teamA : state.teamB;
  const score = teamId === 'A' ? state.scoreA : state.scoreB;
  const fouls = teamId === 'A' ? state.foulsA : state.foulsB;
  const timeouts = teamId === 'A' ? state.timeoutsA : state.timeoutsB;

  if (!team) return null;

  return (
    <Card className="flex-1 shadow-md">
      <CardHeader>
        <CardTitle className="text-center text-primary">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <StatCounter
          label="Goles"
          value={score}
          onIncrement={() => dispatch({ type: 'UPDATE_SCORE', payload: { team: teamId, delta: 1 } })}
          onDecrement={() => dispatch({ type: 'UPDATE_SCORE', payload: { team: teamId, delta: -1 } })}
          icon={<Goal className="h-5 w-5" />}
        />
        <StatCounter
          label="Faltas"
          value={fouls}
          onIncrement={() => dispatch({ type: 'UPDATE_FOULS', payload: { team: teamId, delta: 1 } })}
          onDecrement={() => dispatch({ type: 'UPDATE_FOULS', payload: { team: teamId, delta: -1 } })}
          icon={<Whistle className="h-5 w-5" />}
        />
        <StatCounter
          label="Tiempos Muertos"
          value={timeouts}
          onIncrement={() => dispatch({ type: 'UPDATE_TIMEOUTS', payload: { team: teamId, delta: 1 } })}
          onDecrement={() => dispatch({ type: 'UPDATE_TIMEOUTS', payload: { team: teamId, delta: -1 } })}
          icon={<Timer className="h-5 w-5" />}
        />
      </CardContent>
    </Card>
  );
}
