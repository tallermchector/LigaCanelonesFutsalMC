
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getPosts } from '@/actions/blog-actions';
import { PostCard } from '@/components/blog/PostCard';
import { BlogPagination } from '@/components/blog/Pagination';

type BlogPageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const { posts, totalPages } = await getPosts(currentPage);

  // Separate the first post only if we are on the first page
  const featuredPost = currentPage === 1 && posts.length > 0 ? posts.shift() : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 p-4 py-8 md:p-8 pt-[var(--header-height)]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Blog de Noticias</h1>
          <p className="mt-2 text-muted-foreground">
            Las últimas novedades y análisis de la Liga Canelones Futsal.
          </p>
        </div>

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

      </main>
      <Footer />
    </div>
  );
}
