
'use server';

import type { Post } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
}

const createPostSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().url(),
  content: z.string(),
});

export async function createPostAction(values: z.infer<typeof createPostSchema>) {
  const validatedFields = createPostSchema.safeParse(values);

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
    revalidatePath(`/blog/${slug}`);
  } catch (error) {
    console.error('Failed to write blog post file:', error);
    throw new Error('No se pudo guardar la publicación.');
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
    console.error(`Error reading post with slug ${slug}:`, error);
    return undefined;
  }
}
