'use server';

import { mockPosts } from '@/data/posts';
import type { Post } from '@/types';

const POSTS_PER_PAGE = 4;

// Simula la obtención de posts con paginación
export async function getPosts(page: number = 1): Promise<{ posts: Post[], totalPages: number }> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red

  const publishedPosts = mockPosts.filter(post => post.published);

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  const posts = publishedPosts.slice(startIndex, endIndex);

  return { posts, totalPages };
}

// Simula la obtención de un post por su slug
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red

  return mockPosts.find(post => post.slug === slug && post.published);
}
