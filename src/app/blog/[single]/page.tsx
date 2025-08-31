
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock data for blog posts. In a real app, this would come from a database or CMS.
const mockPosts = [
  {
    slug: 'nueva-temporada-arranca-fuerte',
    title: 'La nueva temporada de la Liga de Futsal arranca con todo',
    description: 'Los equipos favoritos no decepcionaron en la primera jornada, con goleadas y partidos vibrantes que prometen un año emocionante.',
    date: '2024-08-01',
    author: 'Juan Pérez',
    category: 'Noticias',
    content: `
<p>La primera fecha de la temporada ha dejado claro que este año la competencia será más reñida que nunca. Los equipos favoritos, como "Los Quitu" y "Valdearcos", comenzaron con el pie derecho, asegurando victorias contundentes que los posicionan como los rivales a vencer.</p>
<p>El partido inaugural vio a "Los Quitu" enfrentarse a "La Papa Madre" en un encuentro que, si bien se esperaba parejo, terminó con una goleada de 7-2. La eficacia de los delanteros y una defensa sólida fueron las claves para un resultado tan abultado. Daniel Fernández, con un hat-trick, se perfila como uno de los goleadores del campeonato.</p>
<p>Por otro lado, "Wanderers" y "JCC 1930" protagonizaron el partido más emocionante de la jornada. Un empate 4-4 que se definió en los últimos segundos dejó a los espectadores al borde de sus asientos. Ambos equipos mostraron un gran nivel y demostraron por qué son considerados candidatos al título.</p>
<h3 class="text-xl font-bold mt-6 mb-2">Declaraciones post-partido</h3>
<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground">
"Sabíamos que iba a ser un partido difícil, pero el equipo respondió. Estamos contentos con el resultado y ya pensamos en el próximo rival", declaró el capitán de Wanderers.
</blockquote>
<p class="mt-4">La próxima jornada promete más emociones, con enfrentamientos directos entre equipos de la parte alta de la tabla. ¡No te pierdas la cobertura completa en nuestro sitio!</p>
`
  },
  {
    slug: 'sorpresa-en-la-copa',
    title: '¡Sorpresa en la Copa! Equipo revelación elimina al campeón',
    description: 'Nadie lo vio venir. El equipo ascendido esta temporada logró una victoria histórica contra el actual campeón, dejándolo fuera de la copa.',
    date: '2024-07-28',
    author: 'Ana García',
    category: 'Resultados',
    content: '<p>Contenido del post sobre la sorpresa en la copa...</p>'
  },
  {
    slug: 'fichajes-mercado-de-pases',
    title: 'Análisis de los fichajes clave para el segundo semestre',
    description: 'Repasamos los movimientos más importantes del mercado de pases y cómo podrían impactar en el rendimiento de los equipos de cara a la recta final.',
    date: '2024-07-25',
    author: 'Carlos Martinez',
    category: 'Análisis',
    content: '<p>Contenido del post sobre fichajes...</p>'
  }
];

interface PostPageProps {
  params: {
    single: string;
  };
}

export default function SinglePostPage({ params }: PostPageProps) {
  const post = mockPosts.find(p => p.slug === params.single);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8">
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
                <span>Por {post.author}</span> | <span>{new Date(post.date).toLocaleDateString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-accent">{post.category}</p>
            </header>
            
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
  return mockPosts.map(post => ({
    single: post.slug,
  }));
}
