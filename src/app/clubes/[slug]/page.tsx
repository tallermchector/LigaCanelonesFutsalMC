import { getTeamBySlug } from '@/actions/team-actions';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TeamHeader } from '@/components/clubes/TeamHeader';
import { TeamTabs } from '@/components/clubes/TeamTabs';
import type { Team } from '@/types';

interface ClubPageProps {
    params: {
        slug: string;
    };
}

export default async function ClubPage({ params }: ClubPageProps) {
    const team = await getTeamBySlug(params.slug);

    if (!team) {
        notFound();
    }
    
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">
                <TeamHeader team={team as Team} />
                <div className="container mx-auto -mt-16">
                     <TeamTabs team={team as Team} />
                </div>
            </main>
            <Footer />
        </div>
    );
}