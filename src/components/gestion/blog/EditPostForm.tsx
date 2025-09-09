
'use client';

import { useForm } from 'react-hook-form';
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
import { updatePostAction } from '@/actions/blog-actions';
import { Loader2, Save } from 'lucide-react';
import type { Post } from '@/types';

const editPostSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres.'),
  excerpt: z
    .string()
    .min(20, 'El extracto debe tener al menos 20 caracteres.'),
  imageUrl: z.string().url('Debe ser una URL válida.'),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

interface EditPostFormProps {
    post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      content: post.content,
    },
  });

  async function onSubmit(values: EditPostFormValues) {
    setIsSubmitting(true);
    try {
      await updatePostAction(post.slug, values);
      toast({
        title: 'Publicación Actualizada',
        description: 'La publicación ha sido actualizada exitosamente.',
      });
      router.push('/gestion/blog');
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo actualizar el post.';
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la Publicación</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Análisis de los favoritos al título"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                <Input placeholder="https://picsum.photos/1200/600" {...field} />
              </FormControl>
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

        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/gestion/blog')}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-40">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
