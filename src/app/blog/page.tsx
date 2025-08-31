
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Mock data for blog posts. In a real app, this would come from a database or CMS.
const mockPosts = [
  {
    slug: 'nueva-temporada-arranca-fuerte',
    title: 'La nueva temporada de la Liga de Futsal arranca con todo',
    description: 'Los equipos favoritos no decepcionaron en la primera jornada, con goleadas y partidos vibrantes que prometen un año emocionante.',
    date: '2024-08-01',
    author: 'Juan Pérez',
    category: 'Noticias',
  },
  {
    slug: 'sorpresa-en-la-copa',
    title: '¡Sorpresa en la Copa! Equipo revelación elimina al campeón',
    description: 'Nadie lo vio venir. El equipo ascendido esta temporada logró una victoria histórica contra el actual campeón, dejándolo fuera de la copa.',
    date: '2024-07-28',
    author: 'Ana García',
    category: 'Resultados',
  },
  {
    slug: 'fichajes-mercado-de-pases',
    title: 'Análisis de los fichajes clave para el segundo semestre',
    description: 'Repasamos los movimientos más importantes del mercado de pases y cómo podrían impactar en el rendimiento de los equipos de cara a la recta final.',
    date: '2024-07-25',
    author: 'Carlos Martinez',
    category: 'Análisis',
  }
];

export default function BlogPage() {
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
          {mockPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>
                  <span>Por {post.author}</span> | <span>{new Date(post.date).toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })}</span> | <span>Categoría: {post.category}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="p-0">
                  <Link href={`/blog/${post.slug}`}>
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
