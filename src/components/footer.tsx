export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Liga Canelones Futsal. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
