
import { notFound } from 'next/navigation';
import { getMatchStats } from '@/actions/match-actions';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MatchSummaryHeader } from '@/components/resumen/MatchSummaryHeader';
import { MatchSummaryStats } from '@/components/resumen/MatchSummaryStats';
import type { Metadata } from 'next';

interface ResumenPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ResumenPageProps): Promise<Metadata> {
  const match = await getMatchStats(params.id);

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


export default async function ResumenPage({ params }: ResumenPageProps) {
  const match = await getMatchStats(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main 
        className="flex-1 pt-[var(--header-height)] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
      >
        <div className="bg-black/70 min-h-full">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <MatchSummaryHeader match={match} />
                    <MatchSummaryStats match={match} />
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
