
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getPosts } from '@/actions/blog-actions';
import { PostCard } from '@/components/blog/PostCard';
import { BlogPagination } from '@/components/blog/Pagination';
import { PageHero } from '@/components/layout/PageHero';

type BlogPageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams?.page ?? '1');
  const { posts, totalPages } = await getPosts(currentPage);

  // Separate the first post only if we are on the first page
  const featuredPost = currentPage === 1 && posts.length > 0 ? posts.shift() : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHero
          title="Blog de Noticias"
          description="Las últimas novedades y análisis de la Liga Canelones Futsal."
        />
        <div className="container mx-auto p-4 py-8 md:p-8">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPost && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <PostCard post={featuredPost} isFeatured={true} />
                  </div>
                )}
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
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
      </main>
      <Footer />
    </div>
  );
}
