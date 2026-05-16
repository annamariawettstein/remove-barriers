import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: false,
    },
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        'three',
        'three/addons/renderers/CSS3DRenderer.js',
        '@chenglou/pretext',
        '@react-three/fiber',
        '@react-three/drei',
      ],
    },
  },
});
