
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { getPosts } from '@/actions/blog-actions';
import { PostCard } from '@/components/blog/PostCard';
import { BlogPagination } from '@/components/blog/Pagination';
import { animationVariants } from '@/lib/animations';
import type { Post } from '@/types';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

function BlogPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 rounded-lg md:col-span-2 lg:col-span-3" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
        </div>
    );
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
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
        </div>
    </Link>
)


export function BlogPageContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const currentPage = Number(page);

  const [postsData, setPostsData] = useState<{ posts: Post[], totalPages: number }>({ posts: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts(currentPage).then(data => {
      setPostsData(data);
      setLoading(false);
    });
  }, [currentPage]);

  const { posts, totalPages } = postsData;

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.length > 1 ? posts.slice(1, 5) : [];


  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
        {loading ? (
            <BlogPageSkeleton />
        ) : posts.length > 0 ? (
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

            {totalPages > 1 && (
                <div className="mt-12">
                    <BlogPagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath="/blog"
                    />
                </div>
            )}
        </>
        ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-center">
            <h3 className="text-xl font-semibold text-muted-foreground">No hay publicaciones disponibles.</h3>
            <p className="mt-2 text-sm text-muted-foreground">Por favor, vuelve a intentarlo más tarde.</p>
        </div>
        )}
    </div>
  );
}
