
'use client';

import { socialLinks } from '@/data/social-links';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { SocialLink } from '@/types';

export function SocialsBanner() {
  return (
    <section className="py-20 text-center bg-background">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-primary mb-2">Síguenos en Nuestras Redes</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Mantente al día con las últimas noticias, resultados y contenido exclusivo.</p>
            <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link: SocialLink) => {
                    const Icon = link.icon;
                    return(
                        <Button key={link.name} asChild variant="outline" className="transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-primary">
                            <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                {Icon && <Icon className="mr-2 h-5 w-5" />}
                                {link.name}
                            </Link>
                        </Button>
                    )
                })}
            </div>
        </div>
    </section>
  );
}
