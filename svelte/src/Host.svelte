<script>
  import { onMount } from 'svelte'
  import io from 'socket.io-client'

  let socket
  onMount(() => {
    socket = io()
  })
</script>

<main>
  <h1>Host Screen</h1>
  <p>Game state will appear here.</p>
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2rem;
    text-align: center;
  }
</style>
