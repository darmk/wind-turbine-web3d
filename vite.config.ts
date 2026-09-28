import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  // The application is served by Nginx below this prefix in production.
  base: '/windpowerweb3d/',
  plugins: [vue()],
  build: { rollupOptions: { output: { manualChunks(id) { if(id.includes('/three/')) return 'three'; if(id.includes('/gsap/')) return 'motion'; } } } },
});
