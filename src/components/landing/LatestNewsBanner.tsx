
'use client';

import { useState, useEffect } from 'react';
import { PostCard } from '../blog/PostCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Post } from '@/types';
import { getPosts } from '@/actions/blog-actions';
import { Skeleton } from '../ui/skeleton';

function LatestNewsSkeleton() {
    return (
         <div className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto">
            <div className="flex space-x-4">
                 <Skeleton className="h-96 w-full md:w-1/2 lg:w-1/3 rounded-lg" />
                 <Skeleton className="h-96 w-full hidden md:block md:w-1/2 lg:w-1/3 rounded-lg" />
                 <Skeleton className="h-96 w-full hidden lg:block lg:w-1/3 rounded-lg" />
            </div>
         </div>
    )
}


export function LatestNewsBanner() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosts(1).then(({ posts }) => {
            setPosts(posts);
            setLoading(false);
        });
    }, []);
    

    return (
        <section id="news" className="py-20 text-center bg-secondary">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Últimas Noticias</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Enterate de las últimas novedades de la liga.</p>
                
                {loading ? <LatestNewsSkeleton /> : posts.length > 0 ? (
                <>
                    <Carousel 
                    className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    >
                    <CarouselContent>
                        {posts.slice(0, 4).map(post => (
                            <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <PostCard post={post} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                    </Carousel>
                    
                    <div className="mt-12">
                        <Button asChild>
                            <Link href="/blog">Ver todas las noticias</Link>
                        </Button>
                    </div>
                </>
                ) : null}
            </div>
        </section>
    );
}
