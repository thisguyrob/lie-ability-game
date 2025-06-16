<script>
  export let playerName;
  export let gameState;
  
  $: otherPlayers = gameState.players.filter(p => p.name !== playerName);
</script>

<div class="waiting-container">
  <div class="waiting-card">
    <div class="welcome-section">
      <div class="welcome-icon">👋</div>
      <h2 class="welcome-title">Welcome, {playerName}!</h2>
      <p class="welcome-message">
        You're in the game! Waiting for more players to join...
      </p>
    </div>
    
    <div class="status-section">
      <div class="status-indicator">
        <div class="status-dot"></div>
        <span class="status-text">In Lobby</span>
      </div>
      
      <div class="player-count">
        <span class="count-number">{gameState.players.length}</span>
        <span class="count-label">player{gameState.players.length !== 1 ? 's' : ''} joined</span>
      </div>
    </div>
    
    <div class="players-section">
      <h3 class="players-title">Players in Game</h3>
      <div class="players-list">
        {#each gameState.players as player, index}
          <div class="player-item" style="animation-delay: {index * 0.1}s">
            <div class="player-avatar" style="background-color: {player.avatar.color}">
              <span class="player-emoji">{player.avatar.emoji}</span>
            </div>
            <div class="player-info">
              <span class="player-name" class:is-you={player.name === playerName}>
                {player.name}
                {#if player.name === playerName}
                  <span class="you-badge">You</span>
                {/if}
              </span>
              <span class="player-status">Ready</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="game-info">
      <h3 class="info-title">Game Setup</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-icon">🎯</span>
          <span class="info-label">3 Rounds</span>
        </div>
        <div class="info-item">
          <span class="info-icon">❓</span>
          <span class="info-label">17 Questions</span>
        </div>
        <div class="info-item">
          <span class="info-icon">⏱️</span>
          <span class="info-label">~15 Minutes</span>
        </div>
      </div>
    </div>
    
    <div class="waiting-indicator">
      <div class="waiting-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="waiting-text">
        {#if gameState.players.length < 2}
          Waiting for at least 2 players to start...
        {:else}
          Ready to start! Waiting for host...
        {/if}
      </p>
    </div>
  </div>
</div>

<style>
  .waiting-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeIn 0.6s ease;
  }
  
  .waiting-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .welcome-section {
    margin-bottom: 2rem;
  }
  
  .welcome-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: wave 2s ease-in-out infinite;
  }
  
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }
  
  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .welcome-message {
    font-size: 1.1rem;
    color: #666;
    margin: 0;
  }
  
  .status-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 16px;
    margin-bottom: 2rem;
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .status-text {
    font-weight: 600;
    color: #374151;
  }
  
  .player-count {
    text-align: right;
  }
  
  .count-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #667eea;
    display: block;
  }
  
  .count-label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .players-section {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .players-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  .players-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .player-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: slideInUp 0.4s ease both;
  }
  
  .player-item:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.9);
  }
  
  .player-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.3);
    flex-shrink: 0;
  }
  
  .player-emoji {
    font-size: 1.2rem;
  }
  
  .player-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .player-name {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .player-name.is-you {
    color: #667eea;
  }
  
  .you-badge {
    background: #667eea;
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
  }
  
  .player-status {
    font-size: 0.8rem;
    color: #4ade80;
    font-weight: 500;
  }
  
  .game-info {
    margin-bottom: 2rem;
  }
  
  .info-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea20, #764ba220);
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.2);
  }
  
  .info-icon {
    font-size: 1.5rem;
  }
  
  .info-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    text-align: center;
  }
  
  .waiting-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .waiting-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .waiting-dots span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #667eea;
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }
  
  .waiting-dots span:nth-child(1) { animation-delay: -0.32s; }
  .waiting-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes dot-bounce {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  .waiting-text {
    font-size: 1rem;
    color: #666;
    margin: 0;
    text-align: center;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
  
  @media (max-width: 480px) {
    .waiting-container {
      padding: 0.5rem;
    }
    
    .waiting-card {
      padding: 1.5rem;
    }
    
    .welcome-title {
      font-size: 1.8rem;
    }
    
    .status-section {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .info-item {
      flex-direction: row;
      justify-content: center;
      padding: 0.75rem;
    }
    
    .info-label {
      font-size: 0.8rem;
    }
  }
</style>