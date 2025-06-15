<script>
  export let players = []
</script>

<ul class="player-list">
  {#each players as p}
    <li class="player-item">
      <span class="player-avatar" style="background:{p.avatar?.color}">{p.avatar?.emoji}</span>
      <span class="player-name">{p.name}</span>
    </li>
  {/each}
</ul>

<style>
  .player-list {
    list-style: none;
    padding: 0;
  }
  .player-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
  }
  .player-avatar {
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
</style>
