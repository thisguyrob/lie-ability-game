<script>
  export let player = null
  export let isConnected = true
  export let gameState = ''
  
  $: displayName = player?.name || 'Player'
  $: avatar = player?.avatar || { emoji: '😀', color: '#667eea' }
  $: points = player?.points || 0
</script>

<div class="status-bar" class:disconnected={!isConnected}>
  <div class="player-info">
    <div class="avatar" style="background-color: {avatar.color}">
      {avatar.emoji}
    </div>
    <div class="details">
      <span class="name">{displayName}</span>
      <span class="points">{points} points</span>
    </div>
  </div>
  
  <div class="connection-status">
    {#if isConnected}
      <span class="status-dot connected"></span>
      <span class="status-text">Connected</span>
    {:else}
      <span class="status-dot disconnected"></span>
      <span class="status-text">Reconnecting...</span>
    {/if}
  </div>
</div>

<style>
  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    transition: all 0.3s ease;
  }
  
  .status-bar.disconnected {
    background: rgba(254, 178, 178, 0.95);
  }
  
  .player-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .details {
    display: flex;
    flex-direction: column;
  }
  
  .name {
    font-weight: 700;
    color: #2d3748;
    font-size: 1rem;
  }
  
  .points {
    font-size: 0.875rem;
    color: #718096;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .status-dot.connected {
    background: #48bb78;
  }
  
  .status-dot.disconnected {
    background: #f56565;
    animation: blink 1s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  .status-text {
    font-size: 0.875rem;
    color: #4a5568;
    font-weight: 500;
  }
  
  .status-bar.disconnected .status-text {
    color: #c53030;
  }
  
  @media (max-width: 480px) {
    .status-bar {
      padding: 0.5rem 0.75rem;
    }
    
    .avatar {
      width: 35px;
      height: 35px;
      font-size: 1.25rem;
    }
    
    .name {
      font-size: 0.9rem;
    }
    
    .points {
      font-size: 0.8rem;
    }
    
    .status-text {
      font-size: 0.8rem;
    }
  }
</style>