<script>
  export let players = []
  const medals = ['🥇', '🥈', '🥉']
</script>

<section class="scoreboard">
  <h2>Scoreboard</h2>
  <div class="scoreboard-list">
    {#each players as p, index}
      <div class="score-row">
        <div class="rank-cell">
          <span class="rank-medal">{medals[index] || ''}</span>
          {#if index >= 3}
            <span>#{p.rank}</span>
          {/if}
        </div>
        <div class="name-cell">{p.name}</div>
        <div class="lie-cell">{p.lastLie || 'No lie submitted'}</div>
        <div class="fooled-cell">{p.playersFooled} fooled</div>
        <div class="score-cell">{p.points}</div>
      </div>
    {/each}
  </div>
</section>

<style>
  .scoreboard-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .score-row {
    display: grid;
    grid-template-columns: 4rem 1fr 2fr 3rem 3rem;
    gap: 0.5rem;
    align-items: center;
  }
  .rank-cell {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .rank-medal {
    font-size: 1.2rem;
  }
</style>
