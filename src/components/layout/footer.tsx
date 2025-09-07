
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, GanttChartSquare, Shield, Newspaper, Lock, BookUser, Users } from 'lucide-react';


const QuickLink = ({ href, children, icon }: { href: string; children: React.ReactNode, icon?: React.ReactNode }) => (
    <Link href={href} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary group">
        {icon ? React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' }) : <ArrowRight className="h-4 w-4" />}
        <span>{children}</span>
    </Link>
);

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <motion.a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-muted-foreground transition-colors hover:text-primary"
    whileHover={{ scale: 1.2, rotate: -10 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    {icon}
  </motion.a>
);


export function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border">
        <div className="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div className="flex flex-col items-start gap-4">
                 <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
                    <span className="font-bold text-lg whitespace-nowrap">
                      Liga Canaria Futsal 
                    </span>
                </Link>
                <p className="text-sm text-muted-foreground">
                    La plataforma definitiva para los amantes del futsal en la región de Canelones.
                </p>
            </div>
            
            {/* Quick Links */}
            <div>
                <h4 className="font-semibold text-foreground mb-4">Navegación</h4>
                <nav className="flex flex-col gap-2">
                    <QuickLink href="/partidos" icon={<GanttChartSquare />}>Partidos</QuickLink>
                    <QuickLink href="/posiciones" icon={<Shield />}>Posiciones</QuickLink>
                    <QuickLink href="/clubes" icon={<Users />}>Clubes</QuickLink>
                    <QuickLink href="/blog" icon={<Newspaper />}>Noticias</QuickLink>
                </nav>
            </div>

            {/* Legal Links */}
            <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                 <nav className="flex flex-col gap-2">
                    <QuickLink href="/politica-de-privacidad" icon={<Lock />}>Política de Privacidad</QuickLink>
                    <QuickLink href="/terminos-de-servicio" icon={<BookUser />}>Términos de Servicio</QuickLink>
                </nav>
            </div>
            
            {/* Social and Contact */}
            <div>
                <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
                <div className="flex items-center space-x-4 mb-4">
                    <SocialLink href="https://www.instagram.com/ligacanariadefutsaloficial/" icon={<InstagramIcon />} />
                    <SocialLink href="https://www.facebook.com/Ligacanariadefutsal" icon={<FacebookIcon />} />
                    <SocialLink href="https://youtube.com/@ligacanariadefutsaltv" icon={<YoutubeIcon />} />
                </div>
            </div>
        </div>
        <div className="bg-muted/50 py-4">
             <div className="container text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos reservados.
            </div>
        </div>
    </footer>
  );
}
