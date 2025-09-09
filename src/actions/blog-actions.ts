
'use server';

import prisma from '@/lib/prisma';
import type { Post } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { notFound } from 'next/navigation';

function slugify(text: string): string {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
    .replace(/\s+/g, '-')    // Replace spaces with -
    .replace(/--+/g, '-');   // Replace multiple - with single -

  const words = baseSlug.split('-');
  return words.slice(0, 8).join('-');
}

const postSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  category: z.string().min(1, "La categoría es requerida."),
  excerpt: z.string().min(1, 'El extracto es requerido.'),
  imageUrl: z.string().optional(),
  imageBlob: z.string().optional(),
  content: z.string().min(1, 'El contenido es requerido.'),
});

export async function createPostAction(values: z.infer<typeof postSchema>) {
  const validatedFields = postSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Datos inválidos para crear la publicación.');
  }
  
  const { title, excerpt, imageUrl, imageBlob, content, category } = validatedFields.data;
  const slug = slugify(title);

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        imageUrl: imageUrl || '',
        imageBlob: imageBlob ? Buffer.from(imageBlob, 'base64') : null,
        content,
        category,
        published: true, // Default to published
      },
    });
    revalidatePath('/blog');
    revalidatePath('/gestion/blog');
  } catch (error) {
    console.error('Failed to create blog post:', error);
    throw new Error('No se pudo guardar la publicación en la base de datos.');
  }
}

export async function updatePostAction(originalSlug: string, values: z.infer<typeof postSchema>) {
  const validatedFields = postSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Datos inválidos para actualizar la publicación.');
  }

  const { title, excerpt, imageUrl, imageBlob, content, category } = validatedFields.data;
  const newSlug = slugify(title);

  try {
    const post = await prisma.post.findUnique({ where: { slug: originalSlug }});
    if (!post) {
      throw new Error('La publicación original no existe.');
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        title,
        slug: newSlug,
        excerpt,
        imageUrl: imageUrl || '',
        imageBlob: imageBlob ? Buffer.from(imageBlob, 'base64') : post.imageBlob,
        content,
        category,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/gestion/blog');
    revalidatePath(`/blog/${originalSlug}`);
    if (originalSlug !== newSlug) {
      revalidatePath(`/blog/${newSlug}`);
    }
  } catch (error) {
    console.error('Failed to update blog post:', error);
    throw new Error('No se pudo actualizar la publicación.');
  }
}


export async function deletePostAction(slug: string) {
    try {
        await prisma.post.delete({
            where: { slug },
        });
        revalidatePath('/blog');
        revalidatePath('/gestion/blog');
        revalidatePath(`/blog/${slug}`);
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        throw new Error('No se pudo eliminar la publicación.');
    }
}

export async function getPosts(): Promise<{ posts: Post[], totalPages: number }> {
  const postsFromDb = await prisma.post.findMany({
    where: { published: true },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const posts = postsFromDb.map(post => ({
      ...post,
      imageBlob: post.imageBlob ? post.imageBlob.toString('base64') : null,
  }))

  return { posts, totalPages: 1 };
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) return undefined;

    return {
        ...post,
        imageBlob: post.imageBlob ? post.imageBlob.toString('base64') : null
    };
  } catch (error) {
    console.error(`Error reading post with slug ${slug}:`, error);
    return undefined;
  }
}
