
'use client';

import { socialLinks } from '@/data/social-links';
import Link from 'next/link';
import type { SocialLink } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

export function SocialsBanner() {
  return (
    <section className="relative w-full h-screen creative-carousel-hero">
        <Carousel
            className="w-full h-full"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="h-full">
                {socialLinks.map((link: SocialLink) => {
                    const Icon = link.icon;
                    return(
                        <CarouselItem key={link.name} className="relative h-full">
                            <Image
                                src={link.imageUrl}
                                alt={`Background for ${link.name}`}
                                fill
                                className="object-cover"
                                data-ai-hint="social media abstract"
                            />
                            <div className="absolute inset-0 bg-black/60"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                                {Icon && <Icon className="w-16 h-16 mb-4" />}
                                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest">{link.name}</h2>
                                <Link href={link.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-lg font-semibold border-b-2 border-white pb-1 transition-colors hover:text-primary hover:border-primary">
                                    Visitar Perfil
                                </Link>
                            </div>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 text-white bg-white/20 hover:bg-white/40" />
            <CarouselNext className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 text-white bg-white/20 hover:bg-white/40" />
        </Carousel>
    </section>
  );
}
