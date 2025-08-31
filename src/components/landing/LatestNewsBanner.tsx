import { getPosts } from '@/actions/blog-actions';
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

export async function LatestNewsBanner() {
    const { posts } = await getPosts(1);

    if (posts.length === 0) {
        return null;
    }

    // Show only the latest 4 posts
    const latestPosts = posts.slice(0, 4);

    return (
        <section id="news" className="py-20 text-center bg-secondary">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold text-primary mb-2">Últimas Noticias</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Enterate de las últimas novedades de la liga.</p>
                
                <Carousel 
                  className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {latestPosts.map(post => (
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
            </div>
        </section>
    );
}
