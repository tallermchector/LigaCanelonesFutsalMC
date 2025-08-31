import type { Metadata } from 'next';
import { Orbitron, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: '%s | Liga Canelones Futsal',
    default: 'Liga Canelones Futsal - Pasión por el Fútbol Sala',
  },
  description: 'Sigue cada partido, cada gol y cada jugada. La plataforma definitiva para los amantes del fútbol sala en la región de Canelones.',
  openGraph: {
    title: 'Liga Canelones Futsal',
    description: 'La plataforma definitiva para los amantes del futsal en la región.',
    siteName: 'Liga Canelones Futsal',
    type: 'website',
    locale: 'es_UY',
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${roboto.variable} ${orbitron.variable}`} suppressHydrationWarning={true}>
      <head />
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
