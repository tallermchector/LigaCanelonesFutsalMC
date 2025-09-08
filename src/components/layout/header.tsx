
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Menu, Shield, Home, Newspaper, CalendarDays, Tv, Settings, ChevronDown, BarChartHorizontal, PenSquare, LayoutDashboard, Trophy, Users, Info, Briefcase, ListChecks } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navLinks = [
    { href: '/', label: 'Inicio', icon: <Home /> },
    { href: '/blog', label: 'Noticias', icon: <Newspaper /> },
    { href: '/resumen', label: 'Resumen', icon: <BarChartHorizontal /> },
  ];
  
  const infoLinks = [
    { href: '/partidos', label: 'Partidos', icon: <CalendarDays /> },
    { href: '/clubes', label: 'Clubes', icon: <Shield /> },
    { href: '/jugadores', label: 'Jugadores', icon: <Users /> },
    { href: '/posiciones', label: 'Posiciones', icon: <Trophy /> },
  ];

  const adminLinks = [
      { href: '/controles', label: 'Control de Partidos', icon: <Settings /> },
      { href: '/cancha', label: 'Pizarra Táctica', icon: <LayoutDashboard /> },
      { href: '/banner', label: 'Banner en Vivo', icon: <Tv /> },
  ]
  
  const gestionLinks = [
      { href: '/gestion/partidos', label: 'Partidos', icon: <PenSquare /> },
      { href: '/gestion/clubes', label: 'Clubes', icon: <Shield /> },
      { href: '/gestion/jugadores', label: 'Jugadores', icon: <Users /> },
      { href: '/gestion/temporadas', label: 'Temporadas', icon: <Trophy /> },
      { href: '/gestion/configuracion', label: 'Configuración', icon: <Settings /> },
  ]
  
  if (!isMounted) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)]">
            <div className="container flex h-full max-w-screen-2xl items-center justify-between">
                <div className="flex items-center space-x-2">
                     <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
                    <span className="font-bold sm:inline-block text-lg whitespace-nowrap font-orbitron">
                        Liga Canaria Futsal
                    </span>
                </div>
            </div>
        </header>
    );
  }

  return (
    <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? 'bg-background/80 border-b backdrop-blur-lg shadow-lg' : 'bg-transparent border-b border-transparent'
    )}>
      <div className="container flex h-[var(--header-height)] max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
            <span className="font-bold sm:inline-block text-lg whitespace-nowrap font-orbitron">
              Liga Canaria Futsal 
            </span>
        </Link>
        
        <div className="flex items-center gap-4">
            <nav className="hidden gap-2 md:flex">
                {navLinks.map((link) => (
                <Button key={`${link.href}-${link.label}`} variant="ghost" asChild className={cn(
                    "relative text-sm font-medium transition-colors",
                    pathname === link.href ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                )}>
                    <Link href={link.href} className="group">
                        <span className="flex items-center gap-2">
                             {React.cloneElement(link.icon, { className: 'h-4 w-4' })}
                             {link.label}
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             pathname === link.href ? 'scale-x-100' : 'scale-x-0'
                        )} />
                    </Link>
                </Button>
                ))}
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                    "relative text-sm font-medium transition-colors",
                    infoLinks.some(link => pathname.startsWith(link.href)) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    )}>
                       <div className="group">
                        <span className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Información
                            <ChevronDown className="h-4 w-4" />
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             infoLinks.some(link => pathname.startsWith(link.href)) ? 'scale-x-100' : 'scale-x-0'
                        )} />
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {infoLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            {React.cloneElement(link.icon, { className: 'mr-2 h-4 w-4' })}
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                        "relative text-sm font-medium transition-colors",
                        pathname.startsWith('/gestion') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    )}>
                       <div className="group">
                        <span className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            Gestión
                            <ChevronDown className="h-4 w-4" />
                        </span>
                        <span className={cn(
                             "absolute bottom-0 left-0 h-0.5 bg-primary w-full transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                             pathname.startsWith('/gestion') ? 'scale-x-100' : 'scale-x-0'
                        )} />
                       </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {gestionLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            {React.cloneElement(link.icon, { className: 'mr-2 h-4 w-4' })}
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {adminLinks.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>
                            {React.cloneElement(link.icon, { className: 'mr-2 h-4 w-4' })}
                            <span>{link.label}</span>
                          </Link>
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs p-0 flex flex-col bg-background/95 backdrop-blur-lg">
                    <SheetHeader className="p-4 border-b">
                        <SheetClose asChild>
                            <Link href="/" className="flex items-center space-x-2">
                                <Image src="/logofu.svg" alt="Liga Futsal Logo" width={24} height={24} />
                                <span className="font-bold text-base font-orbitron">Liga Canaria Futsal</span>
                            </Link>
                        </SheetClose>
                        <VisuallyHidden>
                            <SheetTitle>Menu de Navegación</SheetTitle>
                        </VisuallyHidden>
                    </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                    <nav className="flex flex-col gap-1 p-4">
                        {navLinks.map((link) => (
                        <SheetClose asChild key={`${link.href}-${link.label}-mobile`}>
                            <Link
                            href={link.href}
                            className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium",
                                pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                            )}
                            >
                            {React.cloneElement(link.icon, { className: 'h-5 w-5' })}
                            {link.label}
                            </Link>
                        </SheetClose>
                        ))}
                         <Accordion type="multiple" className="w-full">
                            <AccordionItem value="info-links" className="border-b-0">
                                <AccordionTrigger className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium hover:no-underline",
                                 infoLinks.some(link => pathname.startsWith(link.href)) ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                )}>
                                    <Info className="h-5 w-5" />
                                    <span className="flex-1 text-left">Información</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pl-8">
                                    <nav className="flex flex-col gap-1 py-2">
                                        {infoLinks.map((link) => (
                                        <SheetClose asChild key={`${link.href}-${link.label}-mobile`}>
                                            <Link
                                            href={link.href}
                                            className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium",
                                                pathname.startsWith(link.href) ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                            )}
                                            >
                                            {React.cloneElement(link.icon, { className: 'h-5 w-5' })}
                                            {link.label}
                                            </Link>
                                        </SheetClose>
                                        ))}
                                    </nav>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="gestion-links" className="border-b-0">
                                <AccordionTrigger className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium hover:no-underline",
                                 pathname.startsWith('/gestion') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                )}>
                                    <ListChecks className="h-5 w-5" />
                                    <span className="flex-1 text-left">Gestión</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pl-8">
                                    <nav className="flex flex-col gap-1 py-2">
                                        {gestionLinks.map((link) => (
                                        <SheetClose asChild key={`${link.href}-${link.label}-mobile-gestion`}>
                                            <Link
                                            href={link.href}
                                            className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium",
                                                pathname.startsWith(link.href) ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                            )}
                                            >
                                            {React.cloneElement(link.icon, { className: 'h-5 w-5' })}
                                            {link.label}
                                            </Link>
                                        </SheetClose>
                                        ))}
                                    </nav>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="admin-links" className="border-b-0">
                                <AccordionTrigger className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium hover:no-underline",
                                 adminLinks.some(link => pathname.startsWith(link.href)) ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                )}>
                                    <Shield className="h-5 w-5" />
                                    <span className="flex-1 text-left">Admin</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 pl-8">
                                     <nav className="flex flex-col gap-1 pt-2">
                                        {adminLinks.map((link) => (
                                        <SheetClose asChild key={`${link.href}-${link.label}-mobile-admin`}>
                                            <Link
                                            href={link.href}
                                            className={cn("flex items-center gap-4 px-4 py-3 text-base rounded-md font-medium",
                                                pathname.startsWith(link.href) ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                                            )}
                                            >
                                            {React.cloneElement(link.icon, { className: 'h-5 w-5' })}
                                            {link.label}
                                            </Link>
                                        </SheetClose>
                                        ))}
                                    </nav>
                                </AccordionContent>
                              </AccordionItem>
                         </Accordion>
                    </nav>
                </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
