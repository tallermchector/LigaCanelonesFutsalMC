
'use server';

import type { Post } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { notFound } from 'next/navigation';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

function slugify(text: string): string {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
    .replace(/\s+/g, '-')    // Replace spaces with -
    .replace(/--+/g, '-');   // Replace multiple - with single -

  // Limit to the first 8 words
  const words = baseSlug.split('-');
  return words.slice(0, 8).join('-');
}

const postSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  excerpt: z.string().min(1, 'El extracto es requerido.'),
  imageUrl: z.string().url('Debe ser una URL válida.'),
  content: z.string().min(1, 'El contenido es requerido.'),
});

export async function createPostAction(values: z.infer<typeof postSchema>) {
  const validatedFields = postSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Datos inválidos para crear la publicación.');
  }
  
  const { title, excerpt, imageUrl, content } = validatedFields.data;

  const slug = slugify(title);
  const createdAt = new Date().toISOString();

  const fileContent = `---
title: '${title.replace(/'/g, "\\'")}'
createdAt: '${createdAt}'
imageUrl: '${imageUrl}'
excerpt: '${excerpt.replace(/'/g, "\\'")}'
---
${content}
`;

  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    await fs.writeFile(filePath, fileContent);
    revalidatePath('/blog');
    revalidatePath('/gestion/blog');
    revalidatePath(`/blog/${slug}`);
  } catch (error) {
    console.error('Failed to write blog post file:', error);
    throw new Error('No se pudo guardar la publicación.');
  }
}

export async function updatePostAction(originalSlug: string, values: z.infer<typeof postSchema>) {
  const validatedFields = postSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Datos inválidos para actualizar la publicación.');
  }

  const { title, excerpt, imageUrl, content } = validatedFields.data;

  const originalPost = await getPostBySlug(originalSlug);
  if (!originalPost) {
    throw new Error('La publicación original no existe.');
  }

  const newSlug = slugify(title);
  const originalFilePath = path.join(postsDirectory, `${originalSlug}.md`);
  const newFilePath = path.join(postsDirectory, `${newSlug}.md`);

  const fileContent = `---
title: '${title.replace(/'/g, "\\'")}'
createdAt: '${originalPost.createdAt}'
imageUrl: '${imageUrl}'
excerpt: '${excerpt.replace(/'/g, "\\'")}'
---
${content}
`;

  try {
    // If the slug changed, delete the old file
    if (originalSlug !== newSlug) {
      await fs.unlink(originalFilePath);
    }
    // Write the new or updated file
    await fs.writeFile(newFilePath, fileContent);

    revalidatePath('/blog');
    revalidatePath('/gestion/blog');
    revalidatePath(`/blog/${originalSlug}`);
    if (originalSlug !== newSlug) {
      revalidatePath(`/blog/${newSlug}`);
    }
  } catch (error) {
    console.error('Failed to update blog post file:', error);
    throw new Error('No se pudo actualizar la publicación.');
  }
}


export async function deletePostAction(slug: string) {
    const filePath = path.join(postsDirectory, `${slug}.md`);

    try {
        await fs.unlink(filePath);
        revalidatePath('/blog');
        revalidatePath('/gestion/blog');
        revalidatePath(`/blog/${slug}`);
    } catch (error) {
        console.error('Failed to delete blog post file:', error);
        throw new Error('No se pudo eliminar la publicación.');
    }
}

export async function getPosts(): Promise<{ posts: Post[], totalPages: number }> {
  const fileNames = await fs.readdir(postsDirectory);
  const allPosts = await Promise.all(fileNames.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id: slug, // Using slug as ID for simplicity
      slug,
      title: matterResult.data.title,
      excerpt: matterResult.data.excerpt,
      imageUrl: matterResult.data.imageUrl,
      createdAt: matterResult.data.createdAt,
      content: matterResult.content,
      published: true, // Assuming all markdown files are published
    } as Post;
  }));

  const sortedPosts = allPosts.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });

  return { posts: sortedPosts, totalPages: 1 };
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id: slug,
      slug,
      title: matterResult.data.title,
      excerpt: matterResult.data.excerpt,
      imageUrl: matterResult.data.imageUrl,
      createdAt: matterResult.data.createdAt,
      content: matterResult.content,
      published: true,
    } as Post;
  } catch (error) {
    // Do not log "file not found" errors as they are expected
    if (error.code !== 'ENOENT') {
      console.error(`Error reading post with slug ${slug}:`, error);
    }
    return undefined;
  }
}
