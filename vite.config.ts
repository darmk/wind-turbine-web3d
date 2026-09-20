import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()], build: { rollupOptions: { output: { manualChunks(id) { if(id.includes('/three/')) return 'three'; if(id.includes('/gsap/')) return 'motion'; } } } } });
