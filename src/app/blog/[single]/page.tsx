
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug, getPosts } from '@/actions/blog-actions';
import Image from 'next/image';

interface PostPageProps {
  params: {
    single: string;
  };
}

export default async function SinglePostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.single);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8 pt-[var(--header-height)]">
        <div className="mx-auto max-w-3xl">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-primary leading-tight">{post.title}</h1>
              <p className="mt-2 text-muted-foreground">
                <span>{new Date(post.createdAt).toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </header>
            
            <Image 
                src={post.imageUrl}
                alt={`Imagen para ${post.title}`}
                width={1200}
                height={600}
                className="w-full rounded-lg object-cover aspect-video mb-8"
            />

            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Generate static paths for all posts
export async function generateStaticParams() {
    const { posts } = await getPosts(1); // Assuming getPosts can fetch all posts
    return posts.map(post => ({
        single: post.slug,
    }));
}
