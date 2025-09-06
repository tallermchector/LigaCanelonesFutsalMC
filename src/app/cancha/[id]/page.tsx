

'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getMatchById, saveMatchState, createGameEvent } from '@/actions/match-actions';
import type { FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { TacticalBoard } from '@/components/cancha/TacticalBoard';
import { GameProvider } from '@/contexts/GameProvider';
import { TacticalHeader } from '@/components/cancha/TacticalHeader';
import { TacticalActions } from '@/components/cancha/TacticalActions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TeamPanel } from '@/components/controles/TeamPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';


function TacticalBoardSkeleton() {
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-800 text-white">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-12" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
            </div>

            {/* Board Skeleton */}
            <div className="flex-grow flex items-center justify-center p-4 relative">
                <Skeleton className="w-full h-full max-w-4xl max-h-[70vh]"/>
            </div>

            {/* Toolbar Skeleton */}
            <div className="flex justify-center items-center p-4 border-t border-gray-700">
                <div className="flex items-center gap-4 bg-gray-700 p-2 rounded-lg">
                    {Array.from({length: 7}).map((_, i) => <Skeleton key={i} className="h-10 w-10" />)}
                </div>
            </div>
        </div>
    );
}


export default function TacticalBoardPage() {
    const params = useParams();
    const matchId = params.id as string;
    
    const [match, setMatch] = useState<FullMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [visiblePanel, setVisiblePanel] = useState<'A' | 'B' | null>(null);

    useEffect(() => {
        if (matchId) {
            const numericId = parseInt(matchId, 10);
            if (isNaN(numericId)) {
                setLoading(false);
                return;
            }
            getMatchById(numericId).then(data => {
                if (data) {
                    setMatch(data);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [matchId]);
    
    if (loading) {
        return <TacticalBoardSkeleton />;
    }

    if (!match) {
        return notFound();
    }
    
    const handleTogglePanel = (panel: 'A' | 'B') => {
        setVisiblePanel(current => current === panel ? null : panel);
    }

    return (
        <GameProvider 
            match={match}
            saveMatchState={saveMatchState}
            createGameEvent={createGameEvent}
        >
            <DndProvider backend={HTML5Backend}>
                <div className="relative h-dvh w-screen bg-gray-900 text-white flex flex-col overflow-hidden">
                    <header className="flex-shrink-0 z-20">
                        <TacticalHeader match={match} />
                    </header>
                    
                    <main className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                            <TacticalBoard match={match} />
                        </div>
                        
                        <AnimatePresence>
                        {visiblePanel && (
                            <motion.div
                                className={cn(
                                    "absolute top-0 bottom-0 z-30 w-72 h-full p-2",
                                    visiblePanel === 'A' ? 'left-0' : 'right-0'
                                )}
                                initial={{ x: visiblePanel === 'A' ? '-100%' : '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: visiblePanel === 'A' ? '-100%' : '100%', opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <TeamPanel teamId={visiblePanel} />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </main>

                    <footer className="flex-shrink-0 z-20">
                      <TacticalActions onTogglePanel={handleTogglePanel} visiblePanel={visiblePanel} />
                    </footer>
                </div>
            </DndProvider>
        </GameProvider>
    );
}
