
import { notFound } from 'next/navigation';
import { getMatchStats } from '@/actions/prisma-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MatchSummaryHeader } from '@/components/resumen/MatchSummaryHeader';
import { MatchSummaryStats } from '@/components/resumen/MatchSummaryStats';
import type { Metadata } from 'next';
import type { MatchStats } from '@/types';


interface ResumenPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: ResumenPageProps): Promise<Metadata> {
  const params = await props.params;
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
      return { title: 'Resumen no encontrado' };
  }
  const match = await getMatchStats(id);

  if (!match) {
    return {
      title: 'Resumen no encontrado',
    };
  }

  const title = `Resumen: ${match.teamA.name} vs ${match.teamB.name}`;
  const description = `Resumen estadístico completo del partido de futsal entre ${match.teamA.name} y ${match.teamB.name}, resultado final ${match.scoreA} - ${match.scoreB}.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}


export default async function ResumenPage(props: ResumenPageProps) {
  const params = await props.params;
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
     notFound();
 }
  const match = await getMatchStats(id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main 
        className="flex-1 pt-[var(--header-height)] bg-gradient-to-br from-background via-card to-background"
      >
        <div className="bg-black/10 min-h-full">
            <div className="container mx-auto px-2 sm:px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <MatchSummaryHeader match={match as MatchStats} />
                    <MatchSummaryStats match={match as MatchStats} />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
