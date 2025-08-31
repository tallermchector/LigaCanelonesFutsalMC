import { FutsalBallIcon } from '@/components/icons';

export function Footer() {
  return (
    <footer className="w-full bg-secondary">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FutsalBallIcon className="h-6 w-6 text-secondary-foreground" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Política de Privacidad</a>
          <a href="#" className="transition-colors hover:text-foreground">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}
