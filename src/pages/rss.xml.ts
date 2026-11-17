import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPosts, url } from '../lib/posts';
export async function GET(context: APIContext) {
  return rss({ title: 'Alec Reynolds', description: 'Notes on technology, community, and the places we share.', site: context.site!, items: (await allPosts()).map(post => ({ title: post.data.title, pubDate: post.data.date, description: post.data.description, categories: post.data.tags, link: url(post) })) });
}
