'use client';

import { socialLinks } from '@/data/social-links';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialCard } from './SocialCard';


export function SocialsBanner() {
  return (
    <section id="socials" className="py-20 text-center bg-background">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-primary mb-2">Síguenos en Redes</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Mantente al día con las últimas noticias, resultados y contenido exclusivo.</p>
            
            <Carousel 
              className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {socialLinks.map((link) => (
                    <CarouselItem key={link.name} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <div className="p-1 h-full">
                            <SocialCard link={link} />
                        </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    </section>
  );
}
