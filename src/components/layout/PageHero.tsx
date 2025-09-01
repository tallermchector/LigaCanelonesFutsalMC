
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <motion.section 
      className="relative bg-cover bg-center py-20 md:py-32 text-center text-white" 
      style={{ backgroundImage: "url('/banner_.jpg')" }}
      variants={animationVariants.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight"
          variants={animationVariants.slideInUp}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-white/80"
            variants={animationVariants.slideInUp}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {children}
          </div>
        )}
      </div>
    </motion.section>
  );
}
