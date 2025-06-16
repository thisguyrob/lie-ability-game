import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../public',
    emptyOutDir: false, // Don't clear the entire public directory
    rollupOptions: {
      input: {
        host: 'src/host.html',
        player: 'src/player.html'
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      },
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
})