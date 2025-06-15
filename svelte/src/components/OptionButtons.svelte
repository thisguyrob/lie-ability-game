<script>
  export let options = []
  export let onSelect = () => {}
</script>

<section class="option-buttons">
  <h3>Select the Truth</h3>
  <ul>
    {#each options as o}
      <li><button on:click={() => onSelect(o.id)}>{o.text}</button></li>
    {/each}
  </ul>
</section>

<style>
  ul { list-style:none; padding:0 }
  li { margin:0.25rem 0 }
  button { padding:0.5rem 1rem; width:100% }
</style>
