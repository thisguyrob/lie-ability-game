<script>
  export let reveal = null
</script>

{#if reveal}
<section class="reveal">
  <h3>{reveal.question}</h3>
  <ul>
    {#each reveal.lies as l}
      <li>{l.lie} - {l.voteCount} {l.voteCount === 1 ? 'vote' : 'votes'}</li>
    {/each}
    <li class="truth">Truth: {reveal.truth.answer} - {reveal.truth.voteCount} correct</li>
  </ul>
</section>
{/if}

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  .truth {
    margin-top: 0.5rem;
    font-weight: bold;
  }
</style>
