
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageHero } from '@/components/layout/PageHero';
import { CreatePostForm } from '@/components/gestion/blog/CreatePostForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import { PostList } from '@/components/gestion/blog/PostList';
import { getPosts } from '@/actions/blog-actions';

export default async function GestionBlogPage() {
    const { posts } = await getPosts();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <PageHero
                    title="Gestión de Blog"
                    description="Crea, edita y administra las publicaciones del blog de la liga."
                />
                <div className="container mx-auto p-4 py-8 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publicaciones Existentes</CardTitle>
                                    <CardDescription>
                                        Aquí puedes ver, editar o eliminar las publicaciones del blog.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PostList posts={posts} />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Newspaper className="h-5 w-5 text-primary" />
                                        Crear Nueva Publicación
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CreatePostForm />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
