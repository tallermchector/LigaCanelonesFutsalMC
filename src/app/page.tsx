
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { FinishedMatches } from '@/components/landing/FinishedMatches';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { SocialsBanner } from '@/components/landing/SocialsBanner';
import { LatestNewsBanner } from '@/components/landing/LatestNewsBanner';
import { getFinishedMatches, getLiveMatches } from '@/actions/match-actions';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';
import { getPosts } from '@/actions/blog-actions';

export default async function Home() {
  const liveMatches = await getLiveMatches();
  const finishedMatches = await getFinishedMatches();
  const { posts } = await getPosts(1);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <motion.main 
        className="flex-1 pt-[var(--header-height)]"
        variants={animationVariants.fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <PageHero
          title="La Pasión del Futsal en Canelones"
          description="Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los amantes del fútbol sala en la región."
        >
          <Button asChild size="lg">
            <Link href="/partidos">Ver Partidos</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
            <Link href="/blog">Ver Noticias</Link>
          </Button>
        </PageHero>
        <LiveMatchesBanner liveMatches={liveMatches} />
        <FinishedMatches finishedMatches={finishedMatches} />
        <LatestNewsBanner posts={posts} />
        <SocialsBanner />
      </motion.main>
      <Footer />
    </div>
  );
}
