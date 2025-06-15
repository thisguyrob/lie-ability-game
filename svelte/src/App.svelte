<script>
  let message = 'Frontend Coming Soon!'
</script>

<main>
  <h1>🎮 Lie-Ability</h1>
  <p>{message}</p>
  <nav>
    <a href="/host">Host Screen</a>
    <a href="/player">Player Screen</a>
  </nav>
</main>

<style>
:global(body) { /* this will apply to <body> */ margin: 0; padding: 0; }

main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2rem;
    text-align: center;
  }

  nav {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  a {
    color: #2c3e50;
    text-decoration: none;
  }
</style>
