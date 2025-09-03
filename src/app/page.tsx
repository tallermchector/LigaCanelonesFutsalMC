
'use client';

import { Footer } from '@/components/layout/footer';
import { LiveMatchesBanner } from '@/components/landing/LiveMatchesBanner';
import { FinishedMatches } from '@/components/landing/FinishedMatches';
import Navbar from '@/components/layout/navbar';
import Hero from '@/components/layout/hero';
import { SocialsBanner } from '@/components/landing/SocialsBanner';
import { LatestNewsBanner } from '@/components/landing/LatestNewsBanner';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LiveMatchesBanner />
        <FinishedMatches />
        <LatestNewsBanner />
        <SocialsBanner />
      </motion.main>
      <Footer />
    </div>
  );
}
