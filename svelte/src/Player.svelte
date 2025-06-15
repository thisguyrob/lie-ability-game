<script>
  import { onMount } from 'svelte'
  import io from 'socket.io-client'

  let socket
  onMount(() => {
    const socketUrl = window.location.port === '5173'
      ? 'http://localhost:3000'
      : window.location.origin
    socket = io(socketUrl)
  })
</script>

<main>
  <h1>Player Screen</h1>
  <p>Your personal interactions will go here.</p>
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2rem;
    text-align: center;
  }
</style>
