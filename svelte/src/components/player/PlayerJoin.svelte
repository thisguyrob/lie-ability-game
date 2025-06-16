<script>
  export let connectionStatus;
  export let onJoin;
  
  let playerName = '';
  let isJoining = false;
  
  function handleJoin() {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    
    if (connectionStatus !== 'connected') {
      alert('Not connected to server. Please wait...');
      return;
    }
    
    isJoining = true;
    onJoin(playerName.trim());
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleJoin();
    }
  }
  
  // Generate a random fun name as placeholder
  function generateRandomName() {
    const adjectives = ['Cool', 'Smart', 'Quick', 'Brave', 'Witty', 'Sharp', 'Clever', 'Bold', 'Sneaky', 'Crafty'];
    const nouns = ['Player', 'Gamer', 'Liar', 'Detective', 'Trickster', 'Genius', 'Master', 'Pro'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
  }
  
  let placeholder = generateRandomName();
</script>

<div class="join-container">
  <div class="join-card">
    <div class="game-logo">
      <div class="logo-icon">🎯</div>
      <h1 class="logo-text">Lie-Ability</h1>
    </div>
    
    <div class="join-content">
      <h2 class="join-title">Join the Game!</h2>
      <p class="join-subtitle">
        Ready to test your deception skills? Enter your name and let's see how well you can lie! 😏
      </p>
      
      <div class="name-input-section">
        <label for="playerName" class="input-label">Your Name</label>
        <input
          id="playerName"
          type="text"
          bind:value={playerName}
          placeholder={placeholder}
          maxlength="20"
          disabled={connectionStatus !== 'connected' || isJoining}
          on:keypress={handleKeyPress}
          class="name-input"
          class:connecting={connectionStatus !== 'connected'}
          autofocus
        />
        
        {#if connectionStatus !== 'connected'}
          <div class="connection-warning">
            <span class="warning-icon">⚠️</span>
            Connecting to server...
          </div>
        {/if}
      </div>
      
      <button
        class="join-button"
        class:disabled={connectionStatus !== 'connected' || isJoining || !playerName.trim()}
        disabled={connectionStatus !== 'connected' || isJoining || !playerName.trim()}
        on:click={handleJoin}
      >
        {#if isJoining}
          <div class="button-spinner"></div>
          Joining...
        {:else if connectionStatus !== 'connected'}
          <span class="button-icon">📡</span>
          Connecting...
        {:else}
          <span class="button-icon">🚀</span>
          Join Game
        {/if}
      </button>
      
      <div class="game-preview">
        <h3 class="preview-title">How to Play</h3>
        <div class="preview-steps">
          <div class="preview-step">
            <span class="step-icon">❓</span>
            <span class="step-text">Read the question</span>
          </div>
          <div class="preview-step">
            <span class="step-icon">🤥</span>
            <span class="step-text">Create a convincing lie</span>
          </div>
          <div class="preview-step">
            <span class="step-icon">🗳️</span>
            <span class="step-text">Vote for the real answer</span>
          </div>
          <div class="preview-step">
            <span class="step-icon">🏆</span>
            <span class="step-text">Score points for fooling others!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .join-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    animation: fadeInUp 0.8s ease;
  }
  
  .join-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }
  
  .game-logo {
    margin-bottom: 2rem;
  }
  
  .logo-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    animation: bounce 2s infinite;
  }
  
  .logo-text {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .join-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
  }
  
  .join-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 2rem 0;
    line-height: 1.5;
  }
  
  .name-input-section {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .input-label {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
  }
  
  .name-input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    background: white;
    box-sizing: border-box;
  }
  
  .name-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .name-input:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
  
  .name-input.connecting {
    border-color: #fbbf24;
    background: #fffbeb;
  }
  
  .connection-warning {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fffbeb;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    color: #92400e;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .warning-icon {
    font-size: 1rem;
  }
  
  .join-button {
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, #4ade80, #22c55e);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .join-button:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
  }
  
  .join-button:active:not(.disabled) {
    transform: translateY(0);
  }
  
  .join-button.disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  .button-icon {
    font-size: 1.3rem;
  }
  
  .button-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .game-preview {
    text-align: left;
  }
  
  .preview-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  .preview-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .preview-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .preview-step:hover {
    transform: translateX(5px);
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  }
  
  .step-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }
  
  .step-text {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
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
  
  @media (max-width: 480px) {
    .join-container {
      padding: 0.5rem;
    }
    
    .join-card {
      padding: 2rem 1.5rem;
    }
    
    .logo-text {
      font-size: 2rem;
    }
    
    .join-title {
      font-size: 1.8rem;
    }
    
    .join-subtitle {
      font-size: 1rem;
    }
    
    .name-input {
      padding: 0.875rem 1rem;
      font-size: 1rem;
    }
    
    .join-button {
      padding: 1rem;
      font-size: 1.1rem;
    }
    
    .preview-steps {
      gap: 0.5rem;
    }
    
    .preview-step {
      padding: 0.5rem;
      gap: 0.75rem;
    }
    
    .step-text {
      font-size: 0.9rem;
    }
  }
</style>