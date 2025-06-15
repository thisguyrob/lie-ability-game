<script>
  export let players = []
</script>

<ul class="player-list">
  {#each players as p, index}
    <li class="player-item" style="animation-delay: {index * 0.1}s">
      <span class="player-avatar" style="background:{p.avatar?.color}">{p.avatar?.emoji}</span>
      <span class="player-name">{p.name}</span>
      <span class="player-status">Ready</span>
    </li>
  {/each}
</ul>

<style>
  .player-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .player-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.2rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    animation: slideInPlayer 0.6s ease-out both;
  }

  .player-item:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  @keyframes slideInPlayer {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .player-avatar {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.5rem;
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .player-name {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .player-status {
    font-size: 0.9rem;
    font-weight: 500;
    color: #48bb78;
    background: rgba(72, 187, 120, 0.2);
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(72, 187, 120, 0.3);
    text-shadow: none;
  }
</style>
