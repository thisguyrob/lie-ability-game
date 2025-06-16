<script>
  export let gameState;
  export let qrCodeUrl;
  export let serverUrl;
  export let onStart;
  
  $: canStart = gameState.players.length >= 2;
</script>

<div class="lobby-container">
  <div class="welcome-section">
    <h2 class="welcome-title">Welcome to Lie-Ability!</h2>
    <p class="welcome-subtitle">
      A party game where creativity meets deception. 
      Create convincing lies and spot the truth!
    </p>
  </div>
  
  <div class="join-section">
    <div class="qr-container">
      <div class="qr-card">
        <h3>Scan to Join</h3>
        {#if qrCodeUrl}
          <img src={qrCodeUrl} alt="QR Code to join game" class="qr-code" />
        {:else}
          <div class="qr-placeholder">
            <div class="loading-spinner"></div>
            <p>Generating QR Code...</p>
          </div>
        {/if}
        <p class="join-url">{serverUrl}</p>
      </div>
    </div>
    
  </div>
  
  <div class="players-section">
    <h3 class="players-title">
      Players ({gameState.players.length})
      {#if gameState.players.length < 2}
        <span class="min-players">Minimum 2 players needed</span>
      {/if}
    </h3>
    
    <div class="players-grid">
      {#each gameState.players as player, index}
        <div class="player-card" style="animation-delay: {index * 0.1}s">
          <div class="player-avatar" style="background-color: {player.avatar.color}">
            <span class="player-emoji">{player.avatar.emoji}</span>
          </div>
          <div class="player-details">
            <span class="player-name">{player.name}</span>
            <span class="player-status">Ready</span>
          </div>
        </div>
      {/each}
      
      {#if gameState.players.length === 0}
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <p>Waiting for players to join...</p>
          <p class="empty-hint">Share the QR code or URL!</p>
        </div>
      {/if}
    </div>
  </div>
  
  <div class="start-section">
    <button 
      class="start-button" 
      class:disabled={!canStart}
      disabled={!canStart}
      on:click={onStart}
    >
      {#if !canStart}
        <span class="button-icon">⏳</span>
        Waiting for Players
      {:else}
        <span class="button-icon">🚀</span>
        Start Game
      {/if}
    </button>
    
    {#if canStart}
      <p class="start-hint">Ready to begin? Let the lies commence! 🎭</p>
    {:else}
      <p class="start-hint">Need at least 2 players to start</p>
    {/if}
  </div>
</div>

<style>
  .lobby-container {
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 3rem;
    padding: 2rem;
    min-height: 60vh;
  }
  
  .welcome-section {
    grid-column: 1 / -1;
    text-align: center;
    animation: fadeInUp 0.8s ease;
  }
  
  .welcome-title {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
  
  .welcome-subtitle {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .join-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: fadeInLeft 0.8s ease 0.2s both;
  }
  
  .qr-container {
    display: flex;
    justify-content: center;
  }
  
  .qr-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .qr-card h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 1.5rem 0;
  }
  
  .qr-code {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  
  .qr-placeholder {
    width: 200px;
    height: 200px;
    background: #f8f9fa;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 0 auto 1rem auto;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .join-url {
    font-size: 0.9rem;
    color: #666;
    word-break: break-all;
    margin: 0;
    font-family: monospace;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 8px;
  }
  
  
  .players-section {
    animation: fadeInRight 0.8s ease 0.4s both;
  }
  
  .players-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0 0 1.5rem 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .min-players {
    font-size: 0.9rem;
    font-weight: 400;
    opacity: 0.8;
  }
  
  .players-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .player-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideInUp 0.3s ease both;
    transition: all 0.3s ease;
  }
  
  .player-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .player-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .player-emoji {
    font-size: 1.5rem;
  }
  
  .player-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .player-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
  
  .player-status {
    font-size: 0.9rem;
    color: #4ade80;
    font-weight: 500;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-state p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
  
  .empty-hint {
    font-size: 0.9rem !important;
    opacity: 0.8;
  }
  
  .start-section {
    grid-column: 1 / -1;
    text-align: center;
    animation: fadeInUp 0.8s ease 0.6s both;
  }
  
  .start-button {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    border: none;
    padding: 1.25rem 3rem;
    border-radius: 50px;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 auto;
  }
  
  .start-button:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
  }
  
  .start-button.disabled {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
    cursor: not-allowed;
    box-shadow: none;
  }
  
  .button-icon {
    font-size: 1.2rem;
  }
  
  .start-hint {
    margin: 1rem 0 0 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .lobby-container {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 1rem;
    }
    
    .welcome-title {
      font-size: 2.5rem;
    }
    
    .welcome-subtitle {
      font-size: 1.1rem;
    }
    
    .qr-code, .qr-placeholder {
      width: 150px;
      height: 150px;
    }
    
    
    .start-button {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }
  }
</style>