
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getMatchByIdFromDb } from '@/actions/prisma-actions';
import type { FullMatch } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { TacticalBoard } from '@/components/cancha/TacticalBoard';
import { GameProvider } from '@/contexts/GameProvider';
import { TacticalHeader } from '@/components/cancha/TacticalHeader';
import { TacticalActions } from '@/components/cancha/TacticalActions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TeamPanel } from '@/components/controles/TeamPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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

    useEffect(() => {
        if (matchId) {
            getMatchByIdFromDb(matchId).then(data => {
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

    return (
        <GameProvider match={match}>
            <DndProvider backend={HTML5Backend}>
                <div className="flex h-dvh w-screen flex-col bg-gray-900 text-white">
                    <TacticalHeader match={match} />
                    <main className="flex-grow flex flex-col md:flex-row p-2 gap-2 overflow-hidden">
                        {/* Desktop: Left Panel */}
                        <div className="hidden md:block w-72 flex-shrink-0">
                          <TeamPanel teamId="A" />
                        </div>
                        
                        {/* Main Content: Board & Mobile Actions */}
                        <div className="flex-grow flex flex-col h-full w-full relative">
                            <div className="flex-grow relative h-full w-full">
                                <TacticalBoard match={match} />
                            </div>
                            <div className="md:hidden flex-shrink-0 mt-2">
                                <TacticalActions />
                            </div>
                        </div>
                        
                         {/* Desktop: Right Panel */}
                        <div className="hidden md:block w-72 flex-shrink-0">
                          <TeamPanel teamId="B" />
                        </div>

                    </main>
                    <div className="hidden md:block flex-shrink-0">
                      <TacticalActions />
                    </div>
                </div>
            </DndProvider>
        </GameProvider>
    );
}
