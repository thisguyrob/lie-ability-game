<script>
  export let onSubmit = () => {}
  export let onAuto = () => {}
  let lie = ''
  const submit = () => { onSubmit(lie); lie = '' }
</script>

<section class="lie-input">
  <input class="lie-field" placeholder="Your lie" bind:value={lie}/>
  <button on:click={submit}>Submit</button>
  <button on:click={onAuto}>Lie for Me</button>
</section>

<style>
  .lie-input { display:flex; flex-direction:column; gap:0.5rem; align-items:center }
  .lie-field { padding:0.5rem; width:100% }
  button { padding:0.5rem 1rem }
</style>
