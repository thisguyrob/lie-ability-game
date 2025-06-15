<script>
  export let options = []
  const letters = 'ABCDEFGH'
</script>

<section class="options">
  <h3>Which answer is the truth?</h3>
  <ul>
    {#each options as o, index}
      <li
        data-letter={letters[index] || index + 1}
        data-length={o.text.length > 50 ? 'very-long' : o.text.length > 25 ? 'long' : undefined}
      >{o.text}</li>
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
