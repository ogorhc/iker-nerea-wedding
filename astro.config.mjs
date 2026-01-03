import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    // Tailwind v4 is configured via PostCSS (postcss.config.mjs)
    // No need for @astrojs/tailwind integration
  ],
  output: 'static',
  vite: {
    ssr: {
      noExternal: ['three'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    css: {
      postcss: './postcss.config.mjs',
    },
  },
});
