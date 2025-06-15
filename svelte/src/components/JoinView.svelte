<script>
  export let onJoin = () => {}
  export let error = ''
  let name = ''
  const submit = () => onJoin(name)
</script>

<section class="join">
  <h2>Join the Game</h2>
  <input class="name-input" placeholder="Name" bind:value={name}/>
  <button on:click={submit}>Join</button>
  {#if error}
    <div class="error">{error}</div>
  {/if}
</section>

<style>
  .join { text-align:center }
  .name-input { padding:0.5rem; margin-top:0.5rem }
  .error { color:red; margin-top:0.5rem }
  button { margin-top:0.5rem }
</style>
