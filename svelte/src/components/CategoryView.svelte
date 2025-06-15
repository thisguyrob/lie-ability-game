<script>
  export let categories = []
  export let selectorName = ''
  export let isSelector = false
</script>

<section class="category">
  <h3>{isSelector ? 'You choose the category' : `${selectorName} is choosing the category...`}</h3>
  <ul>
    {#each categories as c}
      <li>{c.category}</li>
    {/each}
  </ul>
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.25rem 0;
  }
</style>
