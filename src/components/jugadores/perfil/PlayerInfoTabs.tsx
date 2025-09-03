
'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const tabs = ['Resumen', 'Estadísticas'];

export function PlayerInfoTabs() {
    const [activeTab, setActiveTab] = useState('Resumen');

    return (
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto flex">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'flex-1 py-3 text-sm font-semibold text-center transition-colors',
                            activeTab === tab
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
