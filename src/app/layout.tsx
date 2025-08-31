import type { Metadata } from 'next';
import { Orbitron, Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Liga Canelones Futsal',
  description: 'Toda la pasión del futsal en un solo lugar.',
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
