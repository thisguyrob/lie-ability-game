<script>
  export let categories = []
  export let onSelect = () => {}
</script>

<section class="category-picker">
  <h3>Choose a Category</h3>
  <ul>
    {#each categories as c}
      <li><button on:click={() => onSelect(c.id)}>{c.category}</button></li>
    {/each}
  </ul>
</section>

<style>
  ul { list-style:none; padding:0 }
  li { margin:0.25rem 0 }
  button { padding:0.5rem 1rem }
</style>
