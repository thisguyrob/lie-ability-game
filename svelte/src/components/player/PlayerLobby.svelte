<script>
  export let gameState;
  export let myPlayerData;
  
  $: connectedPlayers = gameState.players?.filter(p => p.connected) || [];
  $: totalPlayers = gameState.players?.length || 0;
  $: myPosition = connectedPlayers.findIndex(p => p.id === myPlayerData.id) + 1;
  
  // Group other players for display
  $: otherPlayers = connectedPlayers.filter(p => p.id !== myPlayerData.id);
</script>

<div class="player-lobby">
  <!-- Welcome section -->
  <div class="welcome-section fade-in">
    <div class="welcome-card glass">
      <h1>🎉 You're In!</h1>
      <p>Welcome to the game, <strong>{myPlayerData.name}</strong>!</p>
      <div class="player-preview">
        <div 
          class="player-avatar-large"
          style="background: {myPlayerData.avatar.color}"
        >
          {myPlayerData.avatar.emoji}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Game status -->
  <div class="game-status slide-up">
    <div class="status-card glass">
      <div class="status-header">
        <h2>⏳ Waiting to Start</h2>
        <p>The host will begin the game when everyone is ready.</p>
      </div>
      
      <div class="player-count">
        <div class="count-display">
          <span class="count-number">{connectedPlayers.length}</span>
          <span class="count-label">player{connectedPlayers.length !== 1 ? 's' : ''} joined</span>
        </div>
        
        {#if connectedPlayers.length >= 2}
          <div class="ready-indicator">
            <span class="ready-icon">✅</span>
            <span>Ready to play!</span>
          </div>
        {:else}
          <div class="waiting-indicator">
            <span class="waiting-icon">👥</span>
            <span>Need at least 2 players</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Other players -->
  {#if otherPlayers.length > 0}
    <div class="other-players slide-up">
      <div class="players-card glass">
        <h3>👥 Other Players ({otherPlayers.length})</h3>
        <div class="players-grid">
          {#each otherPlayers as player}
            <div class="player-item">
              <div 
                class="player-avatar"
                style="background: {player.avatar.color}"
              >
                {player.avatar.emoji}
              </div>
              <div class="player-name">{player.name}</div>
              <div class="player-status">
                <span class="status-dot connected"></span>
                <span>Ready</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="waiting-for-players slide-up">
      <div class="waiting-card glass">
        <div class="waiting-content">
          <div class="waiting-animation">👋</div>
          <h3>Waiting for friends...</h3>
          <p>You're the {myPosition === 1 ? 'first' : myPosition === 2 ? 'second' : myPosition + 'th'} player to join!</p>
          <p class="invitation-text">Tell your friends to scan the QR code or visit the game URL to join.</p>
        </div>
      </div>
    </div>
  {/if}
  
</div>

<style>
  .player-lobby {
    height: 100%;
    overflow-y: auto;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .welcome-section {
    text-align: center;
  }
  
  .welcome-card {
    padding: var(--space-6) var(--space-4);
    border-radius: var(--radius-2xl);
  }
  
  .welcome-card h1 {
    color: var(--white);
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-3);
    font-weight: 900;
  }
  
  .welcome-card p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-4);
  }
  
  .welcome-card strong {
    color: var(--white);
    font-weight: 700;
  }
  
  .player-preview {
    display: flex;
    justify-content: center;
  }
  
  .player-avatar-large {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-4xl);
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-lg);
    animation: bounce-in 0.8s ease-out;
  }
  
  .status-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
    text-align: center;
  }
  
  .status-header h2 {
    color: var(--white);
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
    font-weight: 700;
  }
  
  .status-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-4);
  }
  
  .player-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }
  
  .count-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .count-number {
    font-size: var(--font-size-5xl);
    font-weight: 900;
    color: var(--white);
    line-height: 1;
  }
  
  .count-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }
  
  .ready-indicator,
  .waiting-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    font-weight: 600;
  }
  
  .ready-indicator {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .waiting-indicator {
    background: rgba(245, 158, 11, 0.2);
    color: var(--warning);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  
  .ready-icon,
  .waiting-icon {
    font-size: var(--font-size-lg);
  }
  
  .players-card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
  }
  
  .players-card h3 {
    color: var(--white);
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
    font-weight: 700;
    text-align: center;
  }
  
  .players-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-3);
  }
  
  .player-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    transition: all var(--transition);
  }
  
  .player-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  .player-avatar {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .player-name {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-sm);
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
  }
  
  .player-status {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--font-size-xs);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--error);
  }
  
  .status-dot.connected {
    background: var(--success);
    animation: pulse 2s infinite;
  }
  
  .waiting-for-players {
    text-align: center;
  }
  
  .waiting-card {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
  }
  
  .waiting-content {
    color: var(--white);
  }
  
  .waiting-animation {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-4);
    animation: wave 2s ease-in-out infinite;
  }
  
  .waiting-content h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .waiting-content p {
    font-size: var(--font-size-base);
    opacity: 0.9;
    margin-bottom: var(--space-2);
    line-height: 1.5;
  }
  
  .invitation-text {
    font-style: italic;
    opacity: 0.8;
  }
  
  
  
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes wave {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(10deg);
    }
  }
  
  @media (max-width: 768px) {
    .player-lobby {
      padding: var(--space-3);
      gap: var(--space-4);
    }
    
    .welcome-card h1 {
      font-size: var(--font-size-2xl);
    }
    
    .player-avatar-large {
      width: 60px;
      height: 60px;
      font-size: var(--font-size-2xl);
    }
    
    .count-number {
      font-size: var(--font-size-3xl);
    }
    
    .players-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    
    
  }
</style>