<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gameState;
  export let serverInfo;
  export let canStartGame;
  
  const dispatch = createEventDispatcher();
  
  $: connectedPlayers = gameState.players?.filter(p => p.connected) || [];
  $: totalPlayers = gameState.players?.length || 0;
  
  function startGame() {
    dispatch('startGame');
  }
  
  function resetGame() {
    dispatch('resetGame');
  }
  
  // Group players into rows for better display
  $: playerRows = connectedPlayers.reduce((rows, player, index) => {
    const rowIndex = Math.floor(index / 4);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex].push(player);
    return rows;
  }, []);
</script>

<div class="lobby-container">
  <div class="container">
    <!-- Header Section -->
    <div class="lobby-header fade-in">
      <h1 class="game-title">
        <span class="title-emoji">🎯</span>
        Lie-Ability
      </h1>
      <p class="game-subtitle">
        Create convincing lies, find the truth, and fool your friends!
      </p>
    </div>
    
    <!-- Join Instructions -->
    <div class="join-section slide-up">
      <div class="join-card glass">
        <div class="join-content">
          <div class="qr-section">
            {#if serverInfo.qrCodeDataUrl}
              <div class="qr-code">
                <img src={serverInfo.qrCodeDataUrl} alt="QR Code to join game" />
              </div>
            {/if}
            <div class="join-instructions">
              <h3>📱 Join the Game</h3>
              <p>Scan the QR code or visit:</p>
              <div class="url-display">
                {serverInfo.playerUrl || 'Loading...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Players Section -->
    <div class="players-section slide-up">
      <div class="players-header">
        <h2>
          <span class="players-emoji">👥</span>
          Players ({connectedPlayers.length})
        </h2>
        <div class="player-count-indicator">
          <span class="count-badge" class:ready={canStartGame}>
            {connectedPlayers.length}/16
          </span>
          {#if connectedPlayers.length < 2}
            <span class="min-players-text">Need at least 2 players to start</span>
          {/if}
        </div>
      </div>
      
      {#if connectedPlayers.length > 0}
        <div class="players-grid">
          {#each playerRows as row, rowIndex}
            <div class="player-row" style="animation-delay: {rowIndex * 100}ms">
              {#each row as player}
                <div class="player-card bounce-in">
                  <div 
                    class="player-avatar"
                    style="background: {player.avatar.color}"
                  >
                    {player.avatar.emoji}
                  </div>
                  <div class="player-info">
                    <div class="player-name">{player.name}</div>
                    <div class="player-status">
                      <span class="status-dot connected"></span>
                      Ready
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-players">
          <div class="no-players-content">
            <div class="waiting-animation">🕐</div>
            <h3>Waiting for players to join...</h3>
            <p>Share the URL or QR code above with your friends!</p>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Game Controls -->
    <div class="controls-section slide-up">
      <div class="controls-card">
        <div class="controls-content">
          {#if canStartGame}
            <button 
              class="btn btn-primary btn-lg start-button"
              on:click={startGame}
            >
              <span class="button-emoji">🚀</span>
              Start Game
            </button>
            <p class="start-help">
              All players are ready! Click to begin the first round.
            </p>
          {:else}
            <button 
              class="btn btn-secondary btn-lg"
              disabled
            >
              <span class="button-emoji">⏳</span>
              Waiting for Players
            </button>
            <p class="start-help">
              {#if connectedPlayers.length === 0}
                Share the join link with your friends to get started.
              {:else if connectedPlayers.length === 1}
                Need at least one more player to start the game.
              {:else}
                Something went wrong. Please refresh and try again.
              {/if}
            </p>
          {/if}
          
          {#if totalPlayers > 0}
            <button 
              class="btn btn-ghost btn-sm reset-button"
              on:click={resetGame}
            >
              🔄 Reset Game
            </button>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Game Info (only show when few players) -->
    {#if connectedPlayers.length < 4}
      <div class="info-section">
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon">🎯</div>
            <div class="info-content">
              <h4>How to Play</h4>
              <p>Create lies, guess the truth, score points</p>
            </div>
          </div>
          
          <div class="info-card">
            <div class="info-icon">🏆</div>
            <div class="info-content">
              <h4>3 Rounds</h4>
              <p>Points multiply each round</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .lobby-container {
    min-height: 100vh;
    padding: var(--space-6) 0;
  }
  
  .lobby-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .game-title {
    font-size: var(--font-size-6xl);
    font-weight: 900;
    color: var(--white);
    margin-bottom: var(--space-4);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
  }
  
  .title-emoji {
    font-size: var(--font-size-5xl);
    animation: bounce-in 0.8s ease-out;
  }
  
  .game-subtitle {
    font-size: var(--font-size-xl);
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.4;
  }
  
  .join-section {
    margin-bottom: var(--space-8);
  }
  
  .join-card {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-6);
    border-radius: var(--radius-2xl);
  }
  
  .join-content {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .qr-section {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  
  .qr-code {
    background: var(--white);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
  }
  
  .qr-code img {
    display: block;
    width: 160px;
    height: 160px;
  }
  
  .join-instructions {
    text-align: center;
    color: var(--white);
  }
  
  .join-instructions h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-3);
    font-weight: 700;
  }
  
  .join-instructions p {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-3);
    opacity: 0.9;
  }
  
  .url-display {
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-lg);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: var(--font-size-lg);
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    word-break: break-all;
  }
  
  .players-section {
    margin-bottom: var(--space-8);
  }
  
  .players-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);
  }
  
  .players-header h2 {
    font-size: var(--font-size-3xl);
    color: var(--white);
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  
  .players-emoji {
    font-size: var(--font-size-2xl);
  }
  
  .player-count-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }
  
  .count-badge {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: var(--font-size-lg);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all var(--transition);
  }
  
  .count-badge.ready {
    background: var(--success);
    border-color: var(--success);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  }
  
  .min-players-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--font-size-sm);
  }
  
  .players-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .player-row {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .player-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-width: 200px;
    transition: all var(--transition);
  }
  
  .player-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    background: rgba(255, 255, 255, 0.15);
  }
  
  .player-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .player-info {
    flex: 1;
    min-width: 0;
  }
  
  .player-name {
    color: var(--white);
    font-weight: 600;
    font-size: var(--font-size-lg);
    line-height: 1.2;
    word-break: break-word;
  }
  
  .player-status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-1);
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--error);
  }
  
  .status-dot.connected {
    background: var(--success);
    animation: pulse 2s infinite;
  }
  
  .no-players {
    text-align: center;
    padding: var(--space-12) var(--space-6);
  }
  
  .no-players-content {
    color: var(--white);
  }
  
  .waiting-animation {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--space-4);
    animation: spin 2s linear infinite;
  }
  
  .no-players h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-3);
    font-weight: 600;
  }
  
  .no-players p {
    font-size: var(--font-size-lg);
    opacity: 0.8;
  }
  
  .controls-section {
    margin-bottom: var(--space-8);
  }
  
  .controls-card {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  
  .controls-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }
  
  .start-button {
    font-size: var(--font-size-xl);
    padding: var(--space-4) var(--space-8);
    min-height: 60px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .start-button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }
  
  .button-emoji {
    font-size: var(--font-size-2xl);
  }
  
  .start-help {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-lg);
    margin: 0;
    max-width: 400px;
  }
  
  .reset-button {
    margin-top: var(--space-2);
  }
  
  .info-section {
    margin-top: var(--space-12);
  }
  
  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-4);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .info-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--space-5);
    text-align: center;
    color: var(--white);
    transition: all var(--transition);
  }
  
  .info-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }
  
  .info-icon {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-3);
  }
  
  .info-card h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .info-card p {
    opacity: 0.9;
    line-height: 1.4;
  }
  
  @media (max-width: 768px) {
    .game-title {
      font-size: var(--font-size-4xl);
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .title-emoji {
      font-size: var(--font-size-3xl);
    }
    
    .join-content,
    .qr-section {
      flex-direction: column;
      text-align: center;
    }
    
    .qr-code img {
      width: 120px;
      height: 120px;
    }
    
    .players-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .player-count-indicator {
      justify-content: center;
    }
    
    .player-card {
      min-width: auto;
      width: 100%;
      max-width: 300px;
    }
    
    .info-cards {
      grid-template-columns: 1fr;
    }
  }
</style>