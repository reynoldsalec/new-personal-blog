import { getCollection, type CollectionEntry } from 'astro:content';
import legacyUrls from './legacy-urls.json';
export type Post = CollectionEntry<'posts'>;
export const categories = ['All', 'Tech', 'Trails', 'Thoughts'] as const;
export type Category = typeof categories[number];
const thoughts = ['christmas-list', 'verge-tourist', 'nextdoor-and-the-rebirth-of-civil-discourse', 'the-meritocracy-trap-review'];
export function category(post: Post): Category {
  if (post.data.tags.includes('trails')) return 'Trails';
  return thoughts.some(slug => post.id.endsWith(slug)) ? 'Thoughts' : 'Tech';
}
export function url(post: Post): string {
  const legacy = legacyUrls as Record<string, string>;
  return legacy[post.id] ?? `/${post.data.date.toISOString().slice(0, 10).replaceAll('-', '/')}/${post.id.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '')}/`;
}
export const tagUrl = (tag: string) => `/tag/${encodeURIComponent(tag)}/`;
export const categoryUrl = (name: Category) => name === 'All' ? '/#writing' : `/category/${name.toLowerCase()}/#writing`;
export async function allPosts() {
  return (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
