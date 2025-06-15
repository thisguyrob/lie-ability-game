<script>
  export let question = null
</script>

{#if question}
<section class="question">
  <div class="category">{question.category}</div>
  <h3>{question.question}</h3>
</section>
{/if}

<style>
  .category {
    font-size: 0.9rem;
    opacity: 0.8;
  }
</style>
