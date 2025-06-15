<script>
  import Host from './Host.svelte'
  let message = 'Frontend Coming Soon!'
  let showHost = false
  const openHost = () => { showHost = true }
</script>

<main>
  {#if showHost}
    <Host/>
  {:else}
    <h1>🎮 Lie-Ability</h1>
    <p>{message}</p>
    <nav>
      <button on:click={openHost}>Host Screen</button>
      <a href="/player">Player Screen</a>
    </nav>
  {/if}
</main>

<style>
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

  button {
    background: none;
    border: 1px solid #2c3e50;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>
