
import { getTeamBySlug } from '@/actions/team-actions';
import { notFound } from 'next/navigation';
import { TeamHeader } from '@/components/clubes/TeamHeader';
import { TeamTabs } from '@/components/clubes/TeamTabs';
import type { Team } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ClubPageProps {
    params: {
        slug: string;
    };
}

export default async function ClubPage({ params }: ClubPageProps) {
    const { slug } = params;
    const team = await getTeamBySlug(slug);

    if (!team) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <main className="flex-1">
                <TeamHeader team={team as Team} />
                <div className="container mx-auto -mt-24 pb-12">
                     <Button asChild variant="outline" className="mb-4 bg-background">
                        <Link href="/clubes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a Clubes
                        </Link>
                     </Button>
                     <TeamTabs team={team as Team} />
                </div>
            </main>
        </div>
    );
}
