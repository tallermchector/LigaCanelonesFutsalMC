
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
            <div className="flex h-screen w-screen flex-col bg-gray-900 text-white">
                <TacticalHeader match={match} />
                <main className="flex-grow relative">
                     <TacticalBoard match={match} />
                </main>
                <TacticalActions />
            </div>
        </GameProvider>
    );
}
