import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-secondary text-secondary-foreground">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4 md:text-left">
          <Image src="/logofu.svg" alt="Liga Futsal Logo" width={28} height={28} />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos reservados.
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground" aria-label="Footer navigation">
          <Link href="/politica-de-privacidad" className="transition-colors hover:text-foreground">
            Política de Privacidad
          </Link>
          <Link href="/terminos-de-servicio" className="transition-colors hover:text-foreground">
            Términos de Servicio
          </Link>
        </nav>
      </div>
    </footer>
  );
}
