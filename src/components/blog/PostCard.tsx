
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { animationVariants } from '@/lib/animations';

export function PostCard({ post, isFeatured = false }: { post: Post, isFeatured?: boolean }) {

  if (isFeatured) {
    return (
      <motion.div
        variants={animationVariants.slideInUp}
      >
        <Card className="flex flex-col md:flex-row overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20 w-full group">
          <div className="md:w-1/2 relative min-h-[250px]">
            <Link href={`/blog/${post.slug}`} className="block h-full" aria-label={`Leer más sobre ${post.title}`}>
              <Image
                src={post.imageUrl}
                alt={`Imagen para ${post.title}`}
                fill
                className="object-cover"
              />
            </Link>
            <Badge className="absolute top-3 right-3">{post.category}</Badge>
          </div>
          <div className="md:w-1/2 flex flex-col p-6">
             <CardHeader className="p-0">
               <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
               </div>
               <CardTitle className="mb-2 text-2xl font-bold leading-tight hover:text-primary">
                 <Link href={`/blog/${post.slug}`}>{post.title}</Link>
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0 flex-grow">
               <CardDescription className="text-base text-muted-foreground line-clamp-4">
                   {post.excerpt}
               </CardDescription>
             </CardContent>
             <CardFooter className="p-0 pt-4">
                <Link href={`/blog/${post.slug}`} className="font-semibold text-primary inline-flex items-center group-hover:underline">
                    Leer más <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
             </CardFooter>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={animationVariants.slideInUp}
      whileHover={{ y: -4, boxShadow: 'var(--tw-shadow-elevated)' }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden shadow-lg">
        <CardHeader className="relative p-0">
           <Link href={`/blog/${post.slug}`} className="block" aria-label={`Leer más sobre ${post.title}`}>
              <div className="aspect-video">
                <Image
                  src={post.imageUrl}
                  alt={`Imagen para ${post.title}`}
                  fill
                  className="object-cover"
                />
              </div>
          </Link>
          <Badge className="absolute top-3 right-3">{post.category}</Badge>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col p-6">
          <CardTitle className="mb-2 text-xl font-bold leading-tight hover:text-primary">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription className="flex-grow text-muted-foreground line-clamp-3">
              {post.excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
