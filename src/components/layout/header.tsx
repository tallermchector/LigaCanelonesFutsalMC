import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export function Header() {
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/partidos', label: 'Partidos' },
    { href: '/blog', label: 'Noticias' },
    { href: '/banner', label: 'Banners' },
    { href: '/controles', label: 'Controles' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logofu.svg" alt="Liga Futsal Logo" width={24} height={24} />
            <span className="font-bold sm:inline-block">
              Liga Canelones Futsal
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block">
             <Button variant="accent" size="sm" asChild>
                <Link href="/controles" aria-label="Navegar al panel de control">Panel de Control</Link>
              </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle><VisuallyHidden>Menú de navegación móvil</VisuallyHidden></SheetTitle>
              <nav className="flex flex-col gap-4 pt-6">
                {navLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}-mobile`}
                    href={link.href}
                    className="block px-2 py-1 text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                 <Button variant="accent" size="sm" asChild className="mt-4">
                    <Link href="/controles" aria-label="Navegar al panel de control">Panel de Control</Link>
                  </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
