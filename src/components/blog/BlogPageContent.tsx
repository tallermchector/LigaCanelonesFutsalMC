
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

  // Separate the first post only if we are on the first page
  const featuredPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const regularPosts = currentPage === 1 && posts.length > 0 ? posts.slice(1) : posts;


  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
        {loading ? (
            <BlogPageSkeleton />
        ) : posts.length > 0 || featuredPost ? (
        <>
            <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={animationVariants.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            >
            {featuredPost && (
                <div className="md:col-span-2 lg:col-span-3">
                <PostCard post={featuredPost} isFeatured={true} />
                </div>
            )}
            {regularPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
            ))}
            </motion.div>

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
