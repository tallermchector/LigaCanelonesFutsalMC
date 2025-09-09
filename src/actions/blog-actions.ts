'use server';

import type { Post } from '@/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export async function getPosts(): Promise<{ posts: Post[], totalPages: number }> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
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
  });

  const sortedPosts = allPosts.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });

  // The pagination logic is removed as per the new design.
  // Returning totalPages as 1, but this can be adjusted if pagination is added back.
  return { posts: sortedPosts, totalPages: 1 };
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
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
