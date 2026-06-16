// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://s.rafifmsn.com',
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
        fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        display: 'swap',
      },
      {
        provider: fontProviders.google(),
        name: 'Figtree',
        cssVariable: '--font-figtree',
        fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        display: 'swap',
      },
    ],
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});