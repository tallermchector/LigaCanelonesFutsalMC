
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { createPostAction } from '@/actions/blog-actions';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { newsCategories } from '@/data/news-categories';


const createPostSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres.'),
  category: z.string().min(1, "Debes seleccionar una categoría."),
  excerpt: z
    .string()
    .min(20, 'El extracto debe tener al menos 20 caracteres.'),
  imageUrl: z.string().min(10, 'La ruta de la imagen debe tener al menos 10 caracteres.'),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      category: '',
      excerpt: '',
      imageUrl: '',
      content: '',
    },
  });

  const handleGenerateContent = async () => {
    const title = form.getValues('title');
    const category = form.getValues('category');

    if (!title) {
      toast({
        variant: 'destructive',
        title: 'Falta el título',
        description: 'Por favor, escribe un título o tema para generar el contenido.',
      });
      return;
    }
    if (!category) {
      toast({
        variant: 'destructive',
        title: 'Falta la categoría',
        description: 'Por favor, selecciona una categoría para generar el contenido.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBlogPost({ topic: title, category });
      form.setValue('title', result.title, { shouldValidate: true });
      form.setValue('excerpt', result.excerpt, { shouldValidate: true });
      form.setValue('content', result.content, { shouldValidate: true });
      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      toast({
        title: 'Contenido Generado',
        description: 'Se ha generado un borrador para tu publicación.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudo generar el contenido.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: CreatePostFormValues) {
    setIsSubmitting(true);
    try {
      await createPostAction(values);
      toast({
        title: 'Publicación Creada',
        description: 'La nueva publicación ha sido creada exitosamente.',
      });
      form.reset();
      router.push('/gestion/blog');
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo crear el post.';
      toast({
        variant: 'destructive',
        title: 'Error al crear la publicación',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Título de la Publicación o Tema</FormLabel>
                <FormControl>
                    <Input
                    placeholder="Ej: Análisis de los favoritos al título"
                    {...field}
                    />
                </FormControl>
                <FormDescription>
                    Escribe un título claro y conciso para tu artículo. También puedes usar este campo para darle un tema a la IA.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {newsCategories.map((category) => (
                        <SelectItem key={category.slug} value={category.name}>
                        {category.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>
                    Clasifica tu publicación para una mejor organización.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <Button type="button" onClick={handleGenerateContent} disabled={isGenerating || isSubmitting} variant="outline">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isGenerating ? 'Generando...' : 'Generar Contenido con IA'}
        </Button>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extracto</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Un resumen corto que aparecerá en la lista de posts..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen Destacada</FormLabel>
              <FormControl>
                <Input placeholder="Ej: /blog/noticias/mi-imagen.png" {...field} />
              </FormControl>
               <FormDescription>
                Puedes usar una URL completa (https://...) o una ruta local (ej: /blog/imagen.png).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido del Artículo (Markdown)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe el contenido de tu publicación aquí. Puedes usar formato Markdown."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Utiliza la sintaxis de Markdown para títulos, listas, negritas, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || isGenerating} className="w-full">
          {isSubmitting ? 'Publicando...' : 'Publicar Artículo'}
        </Button>
      </form>
    </Form>
  );
}
