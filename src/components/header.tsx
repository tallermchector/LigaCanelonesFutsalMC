import { Goal } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Goal className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg text-primary font-headline">
            Liga Canelones Futsal
          </span>
        </Link>
      </div>
    </header>
  );
}
