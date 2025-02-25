import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    rollupOptions: {
      treeshake: true
    }
  },
  css: {
    preprocessorOptions : {
      scss: {
        api: "modern",
      }        
    } 
  },
  plugins: [
    topLevelAwait(),
    //vue(),
    wasm()
  ],
  server: {
    hmr: false, // Disable hot reload on save
    port: 1024
  }
});
