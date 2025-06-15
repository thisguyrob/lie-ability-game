import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        host: 'host.html',
        player: 'player.html'
      }
    }
  },
  server: {
    port: 5173
  }
})
