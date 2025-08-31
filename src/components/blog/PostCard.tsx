import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
      <Card className="overflow-hidden h-full shadow-lg transition-shadow duration-300 hover:shadow-primary/20 flex flex-col">
        <Link href={`/blog/${post.slug}`} className="block" aria-label={`Leer más sobre ${post.title}`}>
          <CardHeader className="p-0">
            <div className="relative aspect-video">
              <Image
                src={post.imageUrl}
                alt={`Imagen para ${post.title}`}
                fill
                className="object-cover"
              />
            </div>
          </CardHeader>
        </Link>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-xl font-semibold mb-2 hover:text-primary">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <p 
            className="text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </CardFooter>
      </Card>
  );
}
