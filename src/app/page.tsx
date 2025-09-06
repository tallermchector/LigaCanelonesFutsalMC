
'use client';

import { Footer } from '@/components/layout/footer';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { FinishedMatches } from '@/components/landing/FinishedMatches';
import { Header } from '@/components/layout/header';
import Hero from '@/components/layout/hero';
import { SocialsBanner } from '@/components/landing/SocialsBanner';
import { LatestNewsBanner } from '@/components/landing/LatestNewsBanner';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getAllMatchesFromDb } from '@/actions/prisma-actions';
import type { FullMatch } from './types';

export default function Home() {
  const [finishedMatches, setFinishedMatches] = useState<FullMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMatchesFromDb().then(matches => {
        setFinishedMatches(matches.filter(m => m.status === 'FINISHED'));
        setLoading(false);
    });
  }, []);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Hero />
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LiveMatchesBanner />
        <FinishedMatches finishedMatches={finishedMatches} loading={loading} />
        <LatestNewsBanner />
        <SocialsBanner />
      </motion.main>
      <Footer />
    </div>
  );
}
