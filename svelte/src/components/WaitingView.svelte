<section class="waiting">
  <h2>Players are crafting their lies</h2>
  <div class="dots">
    <span></span><span></span><span></span>
  </div>
</section>

<style>
  .waiting {
    text-align: center;
  }
  .dots span {
    animation: blink 1s infinite alternate;
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    margin: 0 0.2rem;
    background: #555;
    border-radius: 50%;
  }
  .dots span:nth-child(2) { animation-delay: 0.3s }
  .dots span:nth-child(3) { animation-delay: 0.6s }
  @keyframes blink { from { opacity: 0.3 } to { opacity: 1 } }
</style>
