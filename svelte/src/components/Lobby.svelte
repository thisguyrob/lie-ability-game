<script>
  import PlayerList from './PlayerList.svelte'
  export let players = []
  export let onStart = () => {}
</script>

<section class="lobby">
  <h2>Join the Game!</h2>
  <PlayerList {players}/>
  <button on:click={onStart} disabled={players.length < 2}>
    {players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
  </button>
</section>

<style>
  .lobby {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
</style>
