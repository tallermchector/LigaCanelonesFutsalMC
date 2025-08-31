
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPosts } from '@/actions/blog-actions';
import Image from 'next/image';

export default async function BlogPage() {
  const { posts } = await getPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Blog de Noticias</h1>
          <p className="mt-2 text-muted-foreground">
            Las últimas novedades y análisis de la Liga Canelones Futsal.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {posts.map((post) => (
            <Card key={post.slug} className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20 flex flex-col md:flex-row">
              <div className="md:w-1/3">
                 <Link href={`/blog/${post.slug}`} className="block h-full">
                    <Image 
                        src={post.imageUrl}
                        alt={`Imagen para ${post.title}`}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full"
                    />
                 </Link>
              </div>
              <div className="md:w-2/3 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-2xl hover:text-primary">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription>
                    <span>{new Date(post.createdAt).toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{post.content.replace(/<[^>]*>/g, '')}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="link" className="p-0">
                    <Link href={`/blog/${post.slug}`}>
                        Leer más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
