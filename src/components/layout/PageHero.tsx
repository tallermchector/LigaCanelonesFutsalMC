
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <motion.section 
      className="relative bg-cover bg-center py-20 md:py-32 text-center text-white" 
      style={{ backgroundImage: "url('/banner_.jpg')" }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight"
          variants={itemVariants}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-white/80"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
