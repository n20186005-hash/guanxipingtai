import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://guanxipingtai.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404/'),
      customPages: ['https://guanxipingtai.com/sources/'],
      changefreq: 'monthly',
      priority: 0.7
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 1024
    }
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained'
  }
});
