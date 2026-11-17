import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.alecreynolds.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
