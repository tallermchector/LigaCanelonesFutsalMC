
'use client';

import type { Metadata } from 'next';
import { Orbitron, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${roboto.variable} ${orbitron.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <title>Liga Canelones Futsal - Pasión por el Fútbol Sala</title>
        <meta name="description" content="Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los amantes del fútbol sala en la región de Canelones." />
        <meta property="og:title" content="Liga Canelones Futsal" />
        <meta property="og:description" content="La plataforma definitiva para los amantes del futsal en la región." />
        <meta property="og:site_name" content="Liga Canelones Futsal" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_UY" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
});