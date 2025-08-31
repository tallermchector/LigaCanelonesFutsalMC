
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  return (
      <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20">
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
  );
}
