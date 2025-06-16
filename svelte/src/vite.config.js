import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        host: resolve(__dirname, 'host.html'),
        player: resolve(__dirname, 'player.html'),
        landing: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})