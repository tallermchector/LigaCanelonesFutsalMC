
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';


export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/partidos', label: 'Partidos' },
    { href: '/blog', label: 'Noticias' },
  ];

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? 'bg-background/95 border-b backdrop-blur-sm shadow-sm' : 'bg-transparent border-b border-transparent'
    )}>
      <div className="container flex h-[var(--header-height)] max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logofu.svg" alt="Liga Futsal Logo" width={32} height={32} />
            <span className="font-bold sm:inline-block text-lg whitespace-nowrap">
              Liga Canaria Futsal 
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn("text-sm font-medium transition-colors hover:text-primary", 
                    pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block">
             <Button variant="outline" size="sm" asChild>
                <Link href="/controles" aria-label="Navegar al panel de control">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                </Link>
              </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 pb-4 text-left border-b">
                     <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logofu.svg" alt="Liga Futsal Logo" width={24} height={24} />
                        <span className="font-bold text-base">Liga Canaria Futsal</span>
                    </Link>
                    <VisuallyHidden><SheetTitle>Menú de navegación móvil</SheetTitle></VisuallyHidden>
                </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={`${link.href}-${link.label}-mobile`}>
                    <Link
                      href={link.href}
                      className={cn("block px-4 py-3 text-base rounded-md font-medium",
                          pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                 <div className="absolute bottom-4 left-4 right-4">
                    <SheetClose asChild>
                    <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href="/controles" aria-label="Navegar al panel de control">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin
                        </Link>
                        </Button>
                    </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
