
'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { BarChart2 } from 'lucide-react'; // Example icon, can be dynamic
import { cn } from '@/lib/utils';

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

export function PageHero({ title, description, icon: Icon, children }: PageHeroProps) {
  return (
    <motion.section 
      className="relative bg-secondary/30 py-16 md:py-24 text-foreground overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/20"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        {Icon && (
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 border-2 border-primary/20 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
              </div>
          </motion.div>
        )}
        <motion.h1 
          className="text-5xl md:text-7xl font-bold font-orbitron"
          variants={itemVariants}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
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
