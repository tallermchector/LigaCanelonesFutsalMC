
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
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

function LatestNewsSkeleton() {
    return (
         <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className='space-y-4'>
                <Skeleton className="h-96 w-full rounded-lg" />
                 <Skeleton className="h-6 w-3/4 rounded-lg" />
                 <Skeleton className="h-5 w-1/2 rounded-lg" />
            </div>
            <div className="space-y-4">
                {Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-6 w-full" />
                             <Skeleton className="h-6 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
         </div>
    )
}

const SmallPostCard = ({ post }: { post: Post }) => (
    <Link href={`/blog/${post.slug}`} className="group flex gap-4 items-center">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
            <Image 
                src={post.imageUrl} 
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="flex-grow">
            <p className="text-primary text-sm font-semibold">{post.category}</p>
            <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
        </div>
    </Link>
)


export function LatestNewsBanner() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPosts(1).then(({ posts }) => {
            setPosts(posts);
            setLoading(false);
        });
    }, []);

    const featuredPost = posts[0];
    const otherPosts = posts.slice(1, 5);
    

    return (
        <section id="news" className="py-20 text-center bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary text-left">Últimas Noticias</h2>
                     <Button asChild variant="link" className="text-primary">
                        <Link href="/blog">
                           Ver todo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                
                {loading ? <LatestNewsSkeleton /> : posts.length > 0 ? (
                <>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {featuredPost && (
                            <PostCard post={featuredPost} isFeatured={true} />
                        )}
                        <div className="flex flex-col gap-6">
                            {otherPosts.map(post => (
                                <SmallPostCard key={post.id} post={post} />
                            ))}
                        </div>
                   </div>
                </>
                ) : null}
            </div>
        </section>
    );
}
